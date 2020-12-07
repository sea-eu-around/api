/* eslint-disable complexity */

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { FindConditions, FindOneOptions } from 'typeorm';

import { LanguageType } from '../../common/constants/language-type';
import { UserEntity } from '../../entities/user.entity';
import { MatchingRepository } from '../../repositories/matching.repository';
import { MessageRepository } from '../../repositories/message.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ConfigService } from '../../shared/services/config.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UserVerificationQueryDto } from '../auth/dto/UserVerificationQueryDto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
        public readonly configService: ConfigService,
        public readonly mailerService: MailerService,
        private readonly _profileRepository: ProfileRepository,
        private readonly _matchingRepository: MatchingRepository,
        private readonly _profileRoomRepository: ProfileRoomRepository,
        private readonly _messageRepository: MessageRepository,
    ) {}

    /**
     * Find single user
     */
    findOne(
        conditions?: FindConditions<UserEntity>,
        options?: FindOneOptions<UserEntity>,
    ): Promise<UserEntity> {
        return this.userRepository.findOne(conditions, options);
    }
    async findByUsernameOrEmail(
        options: Partial<{ username: string; email: string }>,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

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
        const preUser = this.userRepository.create({ ...userRegisterDto });

        const user = await this.userRepository.save(preUser);

        const jwtToken = jwt.sign(
            {
                userId: user.id,
            },
            this.configService.get('JWT_SECRET_KEY'),
            { expiresIn: this.configService.get('JWT_EXPIRATION_TIME') + 's' },
        );

        const mailTemplate =
            user.locale === LanguageType.FR
                ? 'validateMailFR'
                : 'validateMailEN';

        await this.mailerService.sendMail({
            to: user.email, // list of receivers
            from: 'sea-eu.around@univ-brest.fr', // sender address
            subject: 'Your verification token', // Subject line
            template: mailTemplate,
            context: {
                link: `${this.configService.get(
                    'CLIENT_URL',
                )}/validate/${jwtToken}`,
            },
        });

        if (['development', 'staging'].includes(this.configService.nodeEnv)) {
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
                this.configService.get('JWT_SECRET_KEY'),
            )
        );
        const user = await this.userRepository.findOne(userId);

        if (user) {
            user.isVerified = true;

            return this.userRepository.save(user);
        }
        return null;
    }

    async getUserWithAllInfomations(user: UserEntity) {
        const profile = await this._profileRepository.findOne(user.id);
        profile.givenLikes = await this._matchingRepository.find({
            fromProfileId: user.id,
        });
        profile.messages = await this._messageRepository.find({
            senderId: user.id,
        });
        profile.rooms = await this._profileRoomRepository.find({
            where: { profileId: user.id },
            relations: ['room'],
        });

        user.profile = profile;

        return user;
    }
}
