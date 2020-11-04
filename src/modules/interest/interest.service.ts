import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';

// import { FindConditions } from 'typeorm';
import { InterestEntity } from '../../entities/interest.entity';
import { InterestRepository } from '../../repositories/interest.repository';
import { ProfileRepository } from '../../repositories/profile.repository';

@Injectable()
export class InterestService {
    constructor(
        public readonly interestRepository: InterestRepository,
        public readonly profileRepository: ProfileRepository,
    ) {}

    findOne(findData: FindConditions<InterestEntity>): Promise<InterestEntity> {
        return this.interestRepository.findOne(findData);
    }

    async createInterest(key: string): Promise<InterestEntity> {
        const test = await this.interestRepository.findOne({ id: key });
        if (!test) {
            const interest = this.interestRepository.create({ id: key });
            return this.interestRepository.save(interest);
        }
        return test;
    }

    async getAllInterests(): Promise<InterestEntity[]> {
        return this.interestRepository.find();
    }

    async getProfileInterests(profileId: string): Promise<InterestEntity[]> {
        const profile = await this.profileRepository.findOneOrFail(profileId);
        return profile.interests;
    }
}
