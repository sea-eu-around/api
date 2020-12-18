/* eslint-disable complexity */

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Between, FindConditions, FindOneOptions } from 'typeorm';

import { LanguageType } from '../../common/constants/language-type';
import { UserEntity } from '../../entities/user.entity';
import { EmailOrPasswordIncorrectException } from '../../exceptions/email-or-password-incorrect.exception';
import { UserNotVerifiedException } from '../../exceptions/user-not-verified.exception';
import { UtilsService } from '../../providers/utils.service';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ConfigService } from '../../shared/services/config.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UserVerificationQueryDto } from '../auth/dto/UserVerificationQueryDto';
import { UserDeleteDto } from './dto/UserDeleteDto';
import { UserRepository } from './user.repository';
@Injectable()
export class UserService {
    private readonly _logger = new Logger(UserService.name);

    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _profileRepository: ProfileRepository,
        private readonly _configService: ConfigService,
        private readonly _mailerService: MailerService,
        private readonly _schedulerRegistry: SchedulerRegistry,
    ) {}

    /**
     * Find single user
     */
    findOne(
        conditions?: FindConditions<UserEntity>,
        options?: FindOneOptions<UserEntity>,
    ): Promise<UserEntity> {
        return this._userRepository.findOne(conditions, options);
    }
    async findByUsernameOrEmail(
        options: Partial<{ username: string; email: string }>,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this._userRepository.createQueryBuilder('user');

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }
        if (options.username) {
            queryBuilder.orWhere('user.username = :username', {
                username: options.username,
            });
        }

        return queryBuilder.getOne();
    }

    async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
        const preUser = this._userRepository.create({ ...userRegisterDto });

        const user = await this._userRepository.save(preUser);

        const jwtToken = jwt.sign(
            {
                userId: user.id,
            },
            this._configService.get('JWT_SECRET_KEY'),
            { expiresIn: this._configService.get('JWT_EXPIRATION_TIME') + 's' },
        );

        const mailTemplate =
            user.locale === LanguageType.FR
                ? 'validateMail-fr'
                : 'validateMail-en';

        await this._mailerService.sendMail({
            to: user.email, // list of receivers
            from: 'sea-eu.around@univ-brest.fr', // sender address
            subject:
                user.locale === LanguageType.FR
                    ? 'Valider votre compte'
                    : 'Validate your account', // Subject line
            template: mailTemplate,
            context: {
                link: `${this._configService.get(
                    'CLIENT_URL',
                )}/validate/${jwtToken}`,
            },
        });

        if (['development', 'staging'].includes(this._configService.nodeEnv)) {
            user.verificationToken = jwtToken;
        }

        return user;
    }

    async verifyUser(
        userVerificationQueryDto: UserVerificationQueryDto,
    ): Promise<UserEntity> {
        const { userId, iat, exp } = <any>(
            jwt.verify(
                userVerificationQueryDto.token,
                this._configService.get('JWT_SECRET_KEY'),
            )
        );
        const user = await this._userRepository.findOne(userId);

        if (user) {
            user.isVerified = true;

            return this._userRepository.save(user);
        }
        return null;
    }

    async softDeleteUser(
        userDeleteDto: UserDeleteDto,
        user: UserEntity,
    ): Promise<void> {
        const isPasswordValid = await UtilsService.validateHash(
            userDeleteDto.password,
            user && user.password,
        );

        if (!user || !isPasswordValid) {
            throw new EmailOrPasswordIncorrectException();
        }

        if (user && !user.isVerified) {
            throw new UserNotVerifiedException();
        }

        const userToDelete = await this._userRepository
            .createQueryBuilder('user')
            .where({ id: user.id })
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('profile.rooms', 'rooms')
            .leftJoinAndSelect('profile.educationFields', 'educationFields')
            .leftJoinAndSelect('profile.profileOffers', 'profileOffers')
            .leftJoinAndSelect('rooms.room', 'room')
            .leftJoinAndSelect('room.matching', 'matching')
            .getOne();

        await this._userRepository.softRemove(userToDelete);

        if (userToDelete.profile) {
            await this._profileRepository.save({
                id: user.id,
                isActive: false,
            });
        }

        const deletionDate = new Date();
        const offset =
            parseInt(
                this._configService.get('USER_DELETION_MONTHS_OFFSET'),
                10,
            ) || 6;
        deletionDate.setMonth(deletionDate.getMonth() + offset);

        const mailTemplate =
            user.locale === LanguageType.FR
                ? 'deletionRequestConfirmation-fr'
                : 'deletionRequestConfirmation-en';

        await this._mailerService.sendMail({
            to: user.email, // list of receivers
            from: 'sea-eu.around@univ-brest.fr', // sender address
            subject:
                user.locale === LanguageType.FR
                    ? 'Demande de suppression du compte'
                    : 'Account deletion request', // Subject line
            template: mailTemplate,
            context: {
                date: moment(deletionDate)
                    .locale(user.locale === LanguageType.FR ? 'fr' : 'en')
                    .format('LLLL'),
            },
        });
    }

    @Cron('10 * * * * *')
    async userDeletionCron(): Promise<void> {
        const from = new Date();
        const offset =
            parseInt(
                this._configService.get('USER_DELETION_MONTHS_OFFSET'),
                10,
            ) || 6;
        from.setMonth(from.getMonth() - offset);

        const to = new Date(from.getTime());
        to.setHours(to.getHours() + 24);
        this._logger.log({
            startDate: from.toString(),
            endDate: to.toString(),
        });

        const usersToDelete = await this._userRepository.find({
            where: { deletedAt: Between(from, to) },
            withDeleted: true,
        });

        const promesses: Promise<any>[] = [];

        for (const user of usersToDelete) {
            promesses.push(this._userRepository.delete({ id: user.id }));

            const mailTemplate =
                user.locale === LanguageType.FR
                    ? 'deletionConfirmation-fr'
                    : 'deletionConfirmation-en';

            promesses.push(
                this._mailerService.sendMail({
                    to: user.email, // list of receivers
                    from: 'sea-eu.around@univ-brest.fr', // sender address
                    subject:
                        user.locale === LanguageType.FR
                            ? 'Compte supprimé'
                            : 'Account deleted', // Subject line
                    template: mailTemplate,
                }),
            );
        }

        await Promise.all(promesses);
    }
}
