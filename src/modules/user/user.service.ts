/* eslint-disable complexity */

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as jwt from 'jsonwebtoken';
import { FindConditions, FindOneOptions } from 'typeorm';

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
                ? 'validateMailFR'
                : 'validateMailEN';

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

    async deleteUser(
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

        user.deletedAt = new Date();
        await this._userRepository.save(user);
        const deletionDate = user.deletedAt;
        const daysOffset =
            parseInt(
                this._configService.get('USER_DELETION_DAYS_OFFSET'),
                10,
            ) || 30;
        deletionDate.setSeconds(deletionDate.getSeconds() + daysOffset * 86400);

        if (await this._profileRepository.findOne({ id: user.id })) {
            await this._profileRepository.save({
                id: user.id,
                isActive: false,
            });
        }

        // Delete user one month later
        const job = new CronJob(deletionDate, async () => {
            await this._userRepository.delete({ id: user.id });
            this._logger.warn(`User ${user.id} deleted.`);
        });

        this._schedulerRegistry.addCronJob(`delete-user-${user.id}`, job);
        job.start();

        this._logger.warn(
            `User ${
                user.id
            } will be deleted at ${deletionDate.toLocaleString()}.`,
        );
    }
}
