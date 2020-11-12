import { Injectable } from '@nestjs/common';

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

    /*private async _getProfiles(
        fromUser: UserEntity,
        toProfileId: string,
    ): Promise<ProfileEntity[]> {
        const fromProfileQuery = this._profileRepository.findOne(fromUser.id);
        const toProfileQuery = this._profileRepository.findOne(toProfileId);

        const [fromProfile, toProfile] = await Promise.all([
            fromProfileQuery,
            toProfileQuery,
        ]);

        return [fromProfile, toProfile];
    }*/

    async like(
        fromUser: UserEntity,
        toUserId: string,
    ): Promise<MatchingEntity> {
        const toUser = await this._userRepository.findOne(toUserId);

        const mirrorLike = await this._matchingRepository.findOne({
            where: [{ fromUser: toUser, toUser: fromUser }],
        });

        if (mirrorLike) {
            mirrorLike.status = MatchingStatusType.MATCH;
            return this._matchingRepository.save(mirrorLike);
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
        const toUser = await this._userRepository.findOne(toUserId);

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
        const toUser = await this._userRepository.findOne(toUserId);

        const block = this._matchingRepository.create();
        block.fromUser = fromUser;
        block.toUser = toUser;
        block.status = MatchingStatusType.BLOCK;

        return this._matchingRepository.save(block);
    }
}
