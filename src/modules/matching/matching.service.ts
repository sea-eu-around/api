import { BadRequestException, Injectable } from '@nestjs/common';

import { MatchingStatusType } from '../../common/constants/matching-status-type';
import { MatchingEntity } from '../../entities/matching.entity';
import { UserEntity } from '../../entities/user.entity';
import { MatchingRepository } from '../../repositories/matching.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class MatchingService {
    constructor(
        private readonly _matchingRepository: MatchingRepository,
        private readonly _userRepository: UserRepository,
    ) {}

    async like(
        fromUser: UserEntity,
        toUserId: string,
    ): Promise<MatchingEntity> {
        if (fromUser.id === toUserId) {
            throw new BadRequestException("You can't like yourself");
        }

        const toUser = await this._userRepository.findOne(toUserId);

        const mirrorEntity = await this._matchingRepository.findOne({
            where: [{ fromUser: toUser, toUser: fromUser }],
        });

        if (mirrorEntity) {
            switch (mirrorEntity.status) {
                case MatchingStatusType.DECLINE: {
                    return mirrorEntity;
                }
                case MatchingStatusType.BLOCK: {
                    throw new BadRequestException('this user blocked you');
                }
                case MatchingStatusType.MATCH: {
                    throw new BadRequestException('already matched');
                }
                case MatchingStatusType.REQUEST: {
                    mirrorEntity.status = MatchingStatusType.MATCH;
                    return this._matchingRepository.save(mirrorEntity);
                }
            }
        }

        const existingEntity = await this._matchingRepository.findOne({
            where: [{ fromUser, toUser }],
        });

        if (existingEntity) {
            switch (existingEntity.status) {
                case MatchingStatusType.MATCH: {
                    throw new BadRequestException('already matched');
                }
                case MatchingStatusType.REQUEST: {
                    throw new BadRequestException('already liked');
                }
            }
            existingEntity.status = MatchingStatusType.REQUEST;
            return this._matchingRepository.save(existingEntity);
        }

        const like = this._matchingRepository.create();
        like.fromUser = fromUser;
        like.toUser = toUser;
        like.status = MatchingStatusType.REQUEST;

        return this._matchingRepository.save(like);
    }

    async decline(
        fromUser: UserEntity,
        toUserId: string,
    ): Promise<MatchingEntity> {
        if (fromUser.id === toUserId) {
            throw new BadRequestException("You can't decline yourself");
        }

        const toUser = await this._userRepository.findOne(toUserId);

        const mirrorEntity = await this._matchingRepository.findOne({
            where: [{ fromUser: toUser, toUser: fromUser }],
        });

        if (mirrorEntity) {
            switch (mirrorEntity.status) {
                case MatchingStatusType.DECLINE: {
                    break;
                }
                case MatchingStatusType.BLOCK: {
                    throw new BadRequestException('this user blocked you');
                }
                case MatchingStatusType.MATCH: {
                    mirrorEntity.status = MatchingStatusType.DECLINE;
                    return this._matchingRepository.save(mirrorEntity);
                }
                case MatchingStatusType.REQUEST: {
                    mirrorEntity.status = MatchingStatusType.DECLINE;
                    return this._matchingRepository.save(mirrorEntity);
                }
            }
        }

        const existingEntity = await this._matchingRepository.findOne({
            where: [{ fromUser, toUser }],
        });

        if (existingEntity) {
            if (existingEntity.status === MatchingStatusType.DECLINE) {
                throw new BadRequestException('already declined');
            }
            existingEntity.status = MatchingStatusType.DECLINE;
            return this._matchingRepository.save(existingEntity);
        }

        const decline = this._matchingRepository.create();
        decline.fromUser = fromUser;
        decline.toUser = toUser;
        decline.status = MatchingStatusType.DECLINE;

        return this._matchingRepository.save(decline);
    }

    async block(
        fromUser: UserEntity,
        toUserId: string,
    ): Promise<MatchingEntity> {
        if (fromUser.id === toUserId) {
            throw new BadRequestException("You can't block yourself");
        }

        const toUser = await this._userRepository.findOne(toUserId);

        const block = this._matchingRepository.create();
        block.fromUser = fromUser;
        block.toUser = toUser;
        block.status = MatchingStatusType.BLOCK;

        return this._matchingRepository.save(block);
    }
}
