import { Injectable } from '@nestjs/common';

import { MatchingStatusType } from '../../common/constants/matching-status-type';
import { MatchingEntity } from '../../entities/matching.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../entities/user.entity';
import { MatchingRepository } from '../../repositories/matching.repository';
import { ProfileRepository } from '../../repositories/profile.repository';

@Injectable()
export class MatchingService {
    constructor(
        private readonly _matchingRepository: MatchingRepository,
        private readonly _profileRepository: ProfileRepository,
    ) {}

    // eslint-disable-next-line @typescript-eslint/tslint/config
    async _getProfiles(
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
    }

    async like(
        fromUser: UserEntity,
        toProfileId: string,
    ): Promise<MatchingEntity> {
        const [fromProfile, toProfile] = await this._getProfiles(
            fromUser,
            toProfileId,
        );

        const mirrorLike = await this._matchingRepository.findOne({
            where: [{ fromProfile: toProfile, toProfile: fromProfile }],
        });

        if (mirrorLike) {
            mirrorLike.status = MatchingStatusType.MATCH;
            return this._matchingRepository.save(mirrorLike);
        }

        const like = this._matchingRepository.create();
        like.fromProfile = fromProfile;
        like.toProfile = toProfile;
        like.status = MatchingStatusType.REQUEST;

        return this._matchingRepository.save(like);
    }

    async decline(
        fromUser: UserEntity,
        toProfileId: string,
    ): Promise<MatchingEntity> {
        const [fromProfile, toProfile] = await this._getProfiles(
            fromUser,
            toProfileId,
        );

        const decline = this._matchingRepository.create();
        decline.fromProfile = fromProfile;
        decline.toProfile = toProfile;
        decline.status = MatchingStatusType.DECLINE;

        return this._matchingRepository.save(decline);
    }

    async block(
        fromUser: UserEntity,
        toProfileId: string,
    ): Promise<MatchingEntity> {
        const [fromProfile, toProfile] = await this._getProfiles(
            fromUser,
            toProfileId,
        );

        const block = this._matchingRepository.create();
        block.fromProfile = fromProfile;
        block.toProfile = toProfile;
        block.status = MatchingStatusType.BLOCK;

        return this._matchingRepository.save(block);
    }
}
