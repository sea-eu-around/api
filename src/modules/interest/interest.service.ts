import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';

// import { FindConditions } from 'typeorm';
import { InterestEntity } from '../../entities/interest.entity';
import { InterestRepository } from '../../repositories/interest.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { GetInterestsQueryDto } from './dto/GetInterestsQueryDto';

@Injectable()
export class InterestService {
    constructor(
        private readonly _interestRepository: InterestRepository,
        private readonly _profileRepository: ProfileRepository,
    ) {}

    findOne(findData: FindConditions<InterestEntity>): Promise<InterestEntity> {
        return this._interestRepository.findOne(findData);
    }

    async createInterest(key: string): Promise<InterestEntity> {
        const test = await this._interestRepository.findOne({ id: key });
        if (!test) {
            const interest = this._interestRepository.create({ id: key });
            return this._interestRepository.save(interest);
        }
        return test;
    }

    async getMany(query: GetInterestsQueryDto): Promise<InterestEntity[]> {
        const interests = await this._interestRepository.find();

        if (query && query.date) {
            if (
                interests.find(
                    (interest) => interest.updatedAt > new Date(query.date),
                )
            ) {
                return interests;
            }

            return [];
        }

        return interests;
    }

    async getProfileInterests(profileId: string): Promise<InterestEntity[]> {
        const profile = await this._profileRepository.findOneOrFail(profileId);
        return profile.interests;
    }
}
