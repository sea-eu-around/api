/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMetaDto';
import { UserEntity } from '../../entities/user.entity';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UserVerificationQueryDto } from '../auth/dto/UserVerificationQueryDto';
import { UsersPageDto } from './dto/UsersPageDto';
import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {}

    /**
     * Find single user
     */
    findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOne(findData);
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
        const user = this.userRepository.create({ ...userRegisterDto });

        return this.userRepository.save(user);
    }

    async verifyUser(
        userVerificationQueryDto: UserVerificationQueryDto,
    ): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            email: userVerificationQueryDto.email,
            verificationToken: userVerificationQueryDto.token,
        });

        if (user) {
            user.active = true;

            return this.userRepository.save(user);
        }
        return null;
    }

    async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<UsersPageDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        const [users, usersCount] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount: usersCount,
        });
        return new UsersPageDto(users.toDtos(), pageMetaDto);
    }
}
