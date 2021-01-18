import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as jwt from 'jsonwebtoken';

import { LanguageType } from '../../common/constants/language-type';
import { UserDto } from '../../dto/UserDto';
import { UserEntity } from '../../entities/user.entity';
import { EmailOrPasswordIncorrectException } from '../../exceptions/email-or-password-incorrect.exception';
import { UserBeingDeletedException } from '../../exceptions/user-being-deleted.exception';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UserNotVerifiedException } from '../../exceptions/user-not-verified.exception';
import { ContextService } from '../../providers/context.service';
import { UtilsService } from '../../providers/utils.service';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ConfigService } from '../../shared/services/config.service';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { ForgotPasswordDto } from './dto/ForgotPasswordDto';
import { ResetPasswordDto } from './dto/ResetPasswordDto';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
    private static _authUserKey = 'user_key';
    private readonly _logger: Logger = new Logger(AuthService.name);

    constructor(
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
        private readonly _userService: UserService,
        private readonly _userRepository: UserRepository,
        private readonly _profileRepository: ProfileRepository,
        private readonly _mailerService: MailerService,
        private readonly _schedulerRegistry: SchedulerRegistry,
    ) {}

    async createToken(user: UserEntity | UserDto): Promise<TokenPayloadDto> {
        return new TokenPayloadDto({
            expiresIn: this._configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this._jwtService.signAsync({ id: user.id }),
        });
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        let user = await this._userService.findOne(
            {
                email: userLoginDto.email,
            },
            { relations: ['profile'] },
        );
        let isPasswordValid = await UtilsService.validateHash(
            userLoginDto.password,
            user && user.password,
        );

        if (!user || !isPasswordValid) {
            // Check if user has been deleted
            const softDeletedUser = await this._userRepository
                .createQueryBuilder('user')
                .where({
                    email: userLoginDto.email,
                })
                .leftJoinAndSelect('user.profile', 'profile')
                .leftJoinAndSelect('profile.rooms', 'rooms')
                .leftJoinAndSelect('profile.medias', 'medias')
                .leftJoinAndSelect('profile.avatar', 'avatar')
                .leftJoinAndSelect('profile.educationFields', 'educationFields')
                .leftJoinAndSelect('profile.profileOffers', 'profileOffers')
                .leftJoinAndSelect('rooms.room', 'room')
                .leftJoinAndSelect('room.matching', 'matching')
                .withDeleted()
                .getOne();

            isPasswordValid = await UtilsService.validateHash(
                userLoginDto.password,
                softDeletedUser && softDeletedUser.password,
            );

            if (!softDeletedUser || !isPasswordValid) {
                throw new EmailOrPasswordIncorrectException();
            }

            if (!userLoginDto.recover) {
                throw new UserBeingDeletedException();
            }
            user = await this._userRepository.recover(softDeletedUser);

            if (softDeletedUser.profile) {
                await this._profileRepository.save({
                    id: user.id,
                    isActive: true,
                });
            }

            return user;
        }

        if (user && !user.isVerified) {
            throw new UserNotVerifiedException();
        }
        return user;
    }

    async getUserWithProfile(user: UserEntity | UserDto): Promise<UserEntity> {
        return this._userRepository.findOne(
            { id: user.id },
            { relations: ['profile'] },
        );
    }

    async forgotPassword(
        forgotPasswordDto: ForgotPasswordDto,
    ): Promise<UserEntity> {
        const user = await this._userRepository.findOne({
            email: forgotPasswordDto.email,
        });

        if (user) {
            const jwtToken = jwt.sign(
                {
                    userId: user.id,
                },
                this._configService.get('JWT_SECRET_KEY'),
                {
                    expiresIn:
                        this._configService.get('JWT_EXPIRATION_TIME') + 's',
                },
            );

            const mailTemplate =
                user.locale === LanguageType.FR
                    ? 'changePassword-fr'
                    : 'changePassword-en';

            await this._mailerService.sendMail({
                to: user.email, // list of receivers
                from: 'sea-eu.around@univ-brest.fr', // sender address
                subject:
                    user.locale === LanguageType.FR
                        ? 'Mise à jour de votre mot de passe'
                        : 'Change your password', // Subject line
                template: mailTemplate,
                context: {
                    link: `${this._configService.get(
                        'CLIENT_URL',
                    )}/reset-password/${jwtToken}`,
                },
            });
            return user;
        }
        throw new UserNotFoundException();
    }

    async resetPassword(
        resetPasswordDto: ResetPasswordDto,
    ): Promise<UserEntity> {
        const { userId } = <any>(
            jwt.verify(
                resetPasswordDto.token,
                this._configService.get('JWT_SECRET_KEY'),
            )
        );

        const user = await this._userRepository.findOne(userId);
        user.password = resetPasswordDto.password;

        return this._userRepository.save(user);
    }

    static setAuthUser(user: UserEntity): void {
        ContextService.set(AuthService._authUserKey, user);
    }

    static getAuthUser(): UserEntity {
        return ContextService.get(AuthService._authUserKey);
    }
}
