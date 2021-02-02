/* eslint-disable complexity */

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Between, FindConditions, FindOneOptions, In, Not } from 'typeorm';

import { LanguageType } from '../../common/constants/language-type';
import { UserEntity } from '../../entities/user.entity';
import { EmailOrPasswordIncorrectException } from '../../exceptions/email-or-password-incorrect.exception';
import { UserNotVerifiedException } from '../../exceptions/user-not-verified.exception';
import { UtilsService } from '../../providers/utils.service';
import { MediaRepository } from '../../repositories/media.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
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
        private readonly _mediaRepository: MediaRepository,
        private readonly _awsS3Service: AwsS3Service,
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
        // eslint-disable-next-line unused-imports/no-unused-vars-ts
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
            .leftJoinAndSelect('profile.medias', 'medias')
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

        await this.userDeletionCron();
    }

    @Cron('0 0 0 * * *')
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

        const usersToDelete = await this._userRepository.find({
            where: { deletedAt: Between(from, to) },
            withDeleted: true,
        });

        const promesses: Promise<any>[] = [];

        for (const user of usersToDelete) {
            // Retrieve user media
            const medias = await this._mediaRepository.find({
                where: { creatorId: user.id },
                withDeleted: true,
            });

            for (const media of medias) {
                promesses.push(this._awsS3Service.deleteFile(media.path));
            }

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

        this._logger.warn(
            {
                message: `Successfully deleted users between ${from.toString()} and ${to.toString()}.`,
                affectedRows: usersToDelete.length,
                timestamp: new Date(),
            },
            'UserCronDeletion',
        );
    }

    async resendVerificationLink({
        loggedUser,
        send,
    }: {
        loggedUser: UserEntity;
        send: boolean;
    }): Promise<void> {
        let users: UserEntity[];

        if (!send) {
            users = await this._userRepository.find({
                where: {
                    isVerified: false,
                    email: Not(
                        In([
                            'francisco.casanuevagarcia@alum.uca.es',
                            'mamadoubobo.balde@etudiant.univ-brest.fr',
                            'youna.lebolloch@etudiant.univ-brest.fr',
                            'elsa.rivoalen@etudiant.univ-brest.fr',
                            'ivana.pletkovic@unist.hr',
                            'oceane.pirou@etudiant.univ-brest.fr',
                            'e22003481@etudiant.univ-brest.fr',
                            'anaelle.kergus@etudiant.univ-brest.fr',
                            'cedric.sanchez@etudiant.univ-brest.fr',
                            'maxime.rihet@univ-brest.fr',
                            'stu220497@uni-kiel.de',
                            'laura.martinezanton@etudiant.univ-brest.fr',
                            'suzana@ffst.hr',
                            'stu220394@mail.uni-kiel.de',
                            'leolorenzo.lacarin@etudiant.univ-brest.fr',
                            'iurem@svkst.hr',
                            'juan.attard.16@um.edu.mt',
                            'simon.leberre1@etudiant.univ-brest.fr',
                            'justyna.sikorska@ug.edu.pl',
                            'mer.perezmi@alum.uca.es',
                            'arthur.deman@etudiant.univ-brest.fr',
                            'gordana.dujmovic@unist.hr',
                            'e22007451@etudiant.univ-brest.fr',
                            'gcorluka@unist.hr',
                            'clement.leroux4@etudiant.univ-brest.fr',
                            'fbalzereit@uv.uni-kiel.de',
                            'maxime.rihet@etudiant.univ-brest.fr',
                            'sara.verleye@etudiant.univ-brest.fr',
                            'krzysztof.bielawski@ug.edu.pl',
                            'stu220497@mail.uni-kiel.de',
                            'e22010284@etudiant.univ-brest.fr',
                            'dmatas00@fesb.hr',
                            'pb16226@ktf-split.hr',
                            'rekjgs@ug.edu.pl',
                            'siobane.ansquer@etudiant.univ-brest.fr',
                            'mkrnic@ffst.hr',
                            'irene.deandres@uca.es',
                            'younes.ourhzal@etudiant.univ-brest.fr',
                            'stu120108@mail.uni-kiel.de',
                            'irene.rodriguezzaniou@alum.uca.es',
                            'prorector_international@ug.edu.pl',
                            'stu223131@mail.uni-kiel.de',
                            'matthew.xuereb.16@um.edu.mt',
                            'mathilde.pocher@etudiant.univ-brest.fr',
                            'mahault.leroy@etudiant.univ-brest.fr',
                            'jordan.huguenin@etudiant.univ-brest.fr',
                            'melanie.eynard@univ-brest.fr',
                            'mohammed.wakkach@etudiant.univ-brest.fr',
                        ]),
                    ),
                },
            });
        } else {
            users = [loggedUser];
        }
        for (const user of users) {
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
                    ? 'newValidationToken-en'
                    : 'newValidationToken-en';

            await this._mailerService.sendMail({
                to: user.email, // list of receivers
                from: 'sea-eu.around@univ-brest.fr', // sender address
                subject:
                    user.locale === LanguageType.FR
                        ? 'New verification link'
                        : 'New verification link', // Subject line
                template: mailTemplate,
                context: {
                    link: `${this._configService.get(
                        'CLIENT_URL',
                    )}/validate/${jwtToken}`,
                },
            });

            this._logger.warn(`Email to ${user.email} sent 🚀`);

            setTimeout(() => true, 100);
        }
    }
}
