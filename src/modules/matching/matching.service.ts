import { BadRequestException, Injectable } from '@nestjs/common';
import { random } from 'lodash';
import { Brackets } from 'typeorm/query-builder/Brackets';

import { MatchingStatusType } from '../../common/constants/matching-status-type';
import { MatchingEntity } from '../../entities/matching.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { MatchingRepository } from '../../repositories/matching.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class MatchingService {
    constructor(
        private readonly _matchingRepository: MatchingRepository,
        private readonly _userRepository: UserRepository,
        private readonly _profileRepository: ProfileRepository,
    ) {}

    async getMyMatches(profileId: string): Promise<ProfileEntity[]> {
        const matches = await this._matchingRepository
            .createQueryBuilder('matching')
            .leftJoinAndSelect('matching.fromProfile', 'fromProfile')
            .leftJoinAndSelect('matching.toProfile', 'toProfile')
            .where('matching.status = :status', {
                status: MatchingStatusType.MATCH,
            })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('matching.fromProfileId = :id', {
                        id: profileId,
                    }).orWhere('matching.toProfileId = :id', { id: profileId });
                }),
            )
            .orderBy('matching.updated_at', 'DESC')
            .getMany();

        const profiles: ProfileEntity[] = [];

        for (const match of matches) {
            if (match.fromProfileId !== profileId) {
                profiles.push(match.fromProfile);
            } else {
                profiles.push(match.toProfile);
            }
        }

        return profiles;
    }

    async like(
        fromProfileId: string,
        toProfileId: string,
    ): Promise<MatchingEntity> {
        if (fromProfileId === toProfileId) {
            throw new BadRequestException("You can't like yourself");
        }
        const toUser = await this._userRepository.findOne(toProfileId);

        const mirrorEntity = await this._matchingRepository.findOne({
            where: [{ fromProfileId: toProfileId, toProfileId: fromProfileId }],
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
            where: [{ fromProfileId, toProfileId }],
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
        if (toUser.isAutoGenerated === true) {
            const p = random(10);
            if (p >= 5) {
                const fakeMirrorEntity = this._matchingRepository.create();
                fakeMirrorEntity.fromProfileId = toProfileId;
                fakeMirrorEntity.toProfileId = fromProfileId;
                fakeMirrorEntity.status = MatchingStatusType.MATCH;

                return this._matchingRepository.save(fakeMirrorEntity);
            }
        }
        const like = this._matchingRepository.create();
        like.fromProfileId = fromProfileId;
        like.toProfileId = toProfileId;
        like.status = MatchingStatusType.REQUEST;

        return this._matchingRepository.save(like);
    }

    async decline(
        fromProfileId: string,
        toProfileId: string,
    ): Promise<MatchingEntity> {
        if (fromProfileId === toProfileId) {
            throw new BadRequestException("You can't decline yourself");
        }

        const mirrorEntity = await this._matchingRepository.findOne({
            where: [{ fromProfileId: toProfileId, toProfileId: fromProfileId }],
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
            where: [{ fromProfileId, toProfileId }],
        });

        if (existingEntity) {
            if (existingEntity.status === MatchingStatusType.DECLINE) {
                throw new BadRequestException('already declined');
            }
            existingEntity.status = MatchingStatusType.DECLINE;
            return this._matchingRepository.save(existingEntity);
        }

        const decline = this._matchingRepository.create();
        decline.fromProfileId = fromProfileId;
        decline.toProfileId = toProfileId;
        decline.status = MatchingStatusType.DECLINE;

        return this._matchingRepository.save(decline);
    }

    async block(
        fromProfileId: string,
        toProfileId: string,
    ): Promise<MatchingEntity> {
        if (fromProfileId === toProfileId) {
            throw new BadRequestException("You can't block yourself");
        }

        const block = this._matchingRepository.create();
        block.fromProfileId = fromProfileId;
        block.toProfileId = toProfileId;
        block.status = MatchingStatusType.BLOCK;

        return this._matchingRepository.save(block);
    }
}
