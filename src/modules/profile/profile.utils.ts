import { Injectable } from '@nestjs/common';
import { Brackets, SelectQueryBuilder } from 'typeorm';

import { GenderType } from '../../common/constants/gender-type';
import { ProfileType } from '../../common/constants/profile-type';
import { ProfileEntity } from '../../entities/profile.entity';
import { MatchingService } from '../matching/matching.service';

@Injectable()
export class ProfileUtils {
    constructor(private readonly _matchingServices: MatchingService) {}

    public async getUnwantedProfileIds(profileId: string): Promise<string[]> {
        const matchesQuery = this._matchingServices.getMyMatches(profileId);
        const historyQuery = this._matchingServices.getFullHistory(profileId);
        const unwantedProfiles = [profileId];
        const [matches, history] = await Promise.all([
            matchesQuery,
            historyQuery,
        ]);

        matches.forEach((match) => {
            unwantedProfiles.push(match.id);
        });
        history.forEach((match) => {
            unwantedProfiles.push(match);
        });

        return unwantedProfiles;
    }

    public commonHistoryScore(
        fromProfile: ProfileEntity,
        withProfile: ProfileEntity,
    ): number {
        let score = 0;

        const myHistory = fromProfile.givenLikes;
        const withHistory = withProfile.givenLikes;

        if (myHistory && myHistory.length > 0) {
            const mySet = new Set(myHistory);

            if (withHistory && withHistory.length > 0) {
                withHistory.forEach((action) => {
                    if (mySet.has(action)) {
                        score += 1;
                    }
                });
            }
        }

        return score;
    }

    public commonInterestScore(
        fromProfile: ProfileEntity,
        withProfile: ProfileEntity,
    ): number {
        const myInterestsIds = fromProfile.interests.map(
            (interest) => interest.id,
        );
        const withInterestsIds = withProfile.interests.map(
            (interest) => interest.id,
        );

        let score = 0;

        const mySet = new Set(myInterestsIds);

        withInterestsIds.forEach((interest) => {
            if (mySet.has(interest)) {
                score += 1;
            }
        });

        return score;
    }

    public offerScore(withProfile: ProfileEntity, offers: string[]): number {
        let score = 0;

        if (!offers || offers.length === 0) {
            return 0;
        }
        const offerSet = new Set(offers);
        const withOfferIds = withProfile.profileOffers.map(
            (offer) => offer.offerId,
        );

        withOfferIds.forEach((offer) => {
            if (offerSet.has(offer)) {
                score += 1;
            }
        });

        return score;
    }

    public filterOffers(
        myProfile: ProfileEntity,
        profiles: SelectQueryBuilder<ProfileEntity>,
        offers: string[],
    ): SelectQueryBuilder<ProfileEntity> {
        profiles = profiles.andWhere(
            new Brackets((qb) => {
                if (myProfile.gender === GenderType.MALE) {
                    qb.andWhere('profileOffers.allowMale = :bool', {
                        bool: true,
                    });
                }
                if (myProfile.gender === GenderType.FEMALE) {
                    qb.andWhere('profileOffers.allowFemale = :bool', {
                        bool: true,
                    });
                }
                if (myProfile.gender === GenderType.OTHER) {
                    qb.andWhere('profileOffers.allowOther = :bool', {
                        bool: true,
                    });
                }
                if (myProfile.type === ProfileType.STUDENT) {
                    qb.andWhere('profileOffers.allowStudent = :bool', {
                        bool: true,
                    });
                }
                if (myProfile.type === ProfileType.STAFF) {
                    qb.andWhere('profileOffers.allowStaff = :bool', {
                        bool: true,
                    });
                }

                qb.andWhere(
                    new Brackets((subQb) => {
                        for (const offer of offers) {
                            subQb.orWhere(`profileOffers.offerId = '${offer}'`);
                        }
                    }),
                );
            }),
        );

        return profiles;
    }
}
