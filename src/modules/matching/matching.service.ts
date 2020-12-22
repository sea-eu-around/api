import { BadRequestException, Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { random } from 'lodash';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Brackets } from 'typeorm/query-builder/Brackets';

import { MatchingStatusType } from '../../common/constants/matching-status-type';
import { MatchingEntity } from '../../entities/matching.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { MatchingRepository } from '../../repositories/matching.repository';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { UserRepository } from '../user/user.repository';
import { GetHistoryDto } from './dto/getHistoryDto';

@Injectable()
export class MatchingService {
    private _expo: Expo = new Expo();

    constructor(
        private readonly _matchingRepository: MatchingRepository,
        private readonly _userRepository: UserRepository,
        private readonly _roomRepository: RoomRepository,
        private readonly _profileRoomRepository: ProfileRoomRepository,
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

    async getFullHistory(profileId: string): Promise<string[]> {
        const history = await this._matchingRepository
            .createQueryBuilder('matching')
            .leftJoinAndSelect('matching.fromProfile', 'fromProfile')
            .leftJoinAndSelect('matching.toProfile', 'toProfile')
            .where('matching.fromProfileId = :id', { id: profileId })
            .getMany();

        return history.map((match) => match.toProfileId);
    }

    async getHistory(
        profileId: string,
        getHistoryDto: GetHistoryDto,
    ): Promise<Pagination<MatchingEntity>> {
        const historyQuery = this._matchingRepository
            .createQueryBuilder('matching')
            .leftJoinAndSelect('matching.toProfile', 'toProfile')
            .leftJoinAndSelect('toProfile.avatar', 'avatar')
            .where('matching.fromProfileId = :id', { id: profileId })
            .andWhere('matching.status IN (:...status)', {
                status: getHistoryDto.status,
            });

        if (getHistoryDto.search && getHistoryDto.search.length > 0) {
            const fullName = getHistoryDto.search.split(' ');
            historyQuery.andWhere(
                new Brackets((qb) => {
                    for (const word of fullName) {
                        qb.andWhere('toProfile.firstName ilike :search', {
                            search: `%${word}%`,
                        });
                        qb.orWhere('toProfile.lastName ilike :search', {
                            search: `%${word}%`,
                        });
                    }
                }),
            );
        }

        historyQuery.orderBy('matching.updatedAt', 'DESC');

        const options: IPaginationOptions = {
            limit: getHistoryDto.limit,
            page: getHistoryDto.page,
        };

        return paginate<MatchingEntity>(historyQuery, options);
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

                    const room = this._roomRepository.create();
                    room.matching = mirrorEntity;
                    room.profiles = this._profileRoomRepository.createForProfileIds(
                        [fromProfileId, toProfileId],
                    );
                    await this._roomRepository.save(room);

                    const notification: ExpoPushMessage = {
                        to: toUser.expoPushToken || toUser.email,
                        sound: 'default',
                        body: 'You have a new match!',
                    };

                    await this._expo.sendPushNotificationsAsync([notification]);

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

                const savedMatch = await this._matchingRepository.save(
                    fakeMirrorEntity,
                );

                const room = this._roomRepository.create();
                room.matching = savedMatch;
                room.profiles = this._profileRoomRepository.createForProfileIds(
                    [fromProfileId, toProfileId],
                );
                await this._roomRepository.save(room);

                return savedMatch;
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
