import { Injectable } from '@nestjs/common';

import { MatchingStatusType } from '../../common/constants/matching-status-type';
import { MatchingEntity } from '../../entities/matching.entity';
import { UserEntity } from '../../entities/user.entity';
import { MatchingRepository } from '../../repositories/matching.repository';
import { ProfileRepository } from '../../repositories/profile.repository';

@Injectable()
export class MatchingService {
    constructor(
        private readonly _matchingRepository: MatchingRepository,
        private readonly _profileRepository: ProfileRepository,
    ) {}

    async like(
        fromUser: UserEntity,
        toProfileId: string,
    ): Promise<MatchingEntity> {
        const fromProfileQuery = this._profileRepository.findOne(
            fromUser.profileId,
        );
        const toProfileQuery = this._profileRepository.findOne(toProfileId);

        const [fromProfile, toProfile] = await Promise.all([
            fromProfileQuery,
            toProfileQuery,
        ]);

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
}
