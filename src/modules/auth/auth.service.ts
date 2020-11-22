import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { UserDto } from '../../dto/UserDto';
import { UserEntity } from '../../entities/user.entity';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UserNotVerifiedException } from '../../exceptions/user-not-verified.exception';
import { ContextService } from '../../providers/context.service';
import { UtilsService } from '../../providers/utils.service';
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

    constructor(
        public readonly jwtService: JwtService,
        public readonly configService: ConfigService,
        public readonly userService: UserService,
        public readonly userRepository: UserRepository,
        public readonly mailerService: MailerService,
    ) {}

    async createToken(user: UserEntity | UserDto): Promise<TokenPayloadDto> {
        return new TokenPayloadDto({
            expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this.jwtService.signAsync({ id: user.id }),
        });
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        const user = await this.userService.findOne({
            email: userLoginDto.email,
        });
        const isPasswordValid = await UtilsService.validateHash(
            userLoginDto.password,
            user && user.password,
        );
        if (!user || !isPasswordValid) {
            throw new UserNotFoundException();
        }

        if (user && !user.isVerified) {
            throw new UserNotVerifiedException();
        }

        return user;
    }

    async getUserWithProfile(user: UserEntity | UserDto): Promise<UserEntity> {
        return this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('profile.languages', 'languages')
            .where('user.id= :userId', { userId: user.id })
            .getOne();
    }

    async forgotPassword(
        forgotPasswordDto: ForgotPasswordDto,
    ): Promise<UserEntity> {
        const user = await this.userRepository.findOneOrFail({
            email: forgotPasswordDto.email,
        });

        const jwtToken = jwt.sign(
            {
                userId: user.id,
            },
            this.configService.get('JWT_SECRET_KEY'),
            { expiresIn: this.configService.get('JWT_EXPIRATION_TIME') + 's' },
        );

        await this.mailerService.sendMail({
            to: user.email, // list of receivers
            from: 'sea-eu.around@univ-brest.fr', // sender address
            subject: 'Change your password', // Subject line
            template: 'changePasswordEN',
            context: {
                link: `${this.configService.get(
                    'CLIENT_URL',
                )}/reset-password?t=${jwtToken}`,
            },
        });
        return user;
    }

    async resetPassword(
        resetPasswordDto: ResetPasswordDto,
    ): Promise<UserEntity> {
        const { userId, iat, exp } = <any>(
            jwt.verify(
                resetPasswordDto.jwtToken,
                this.configService.get('JWT_SECRET_KEY'),
            )
        );

        const user = await this.userRepository.findOne(userId);
        user.password = resetPasswordDto.password;

        return this.userRepository.save(user);
    }

    static setAuthUser(user: UserEntity): void {
        ContextService.set(AuthService._authUserKey, user);
    }

    static getAuthUser(): UserEntity {
        return ContextService.get(AuthService._authUserKey);
    }
}
