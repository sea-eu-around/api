import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';

// import { FindConditions } from 'typeorm';
import { InterestEntity } from '../../entities/interest.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { ProfileRepository } from '../../repositories/profile.repository';
import { InterestRepository } from './interest.repository';

@Injectable()
export class InterestService {
    constructor(
        public readonly interestRepository: InterestRepository,
        public readonly profileRepository: ProfileRepository,
    ) {}

    findOne(findData: FindConditions<InterestEntity>): Promise<InterestEntity> {
        return this.interestRepository.findOne(findData);
    }

    async createInterest(name: string): Promise<InterestEntity> {
        const interest = this.interestRepository.create({ name });

        return this.interestRepository.save(interest);
    }

    async addInterestToProfile(
        userProfile: ProfileEntity,
        interests: InterestEntity[],
    ): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findOne(userProfile);
        for (const interest of interests) {
            if (!profile.interests.includes(interest)) {
                profile.interests.push(interest);
            }
        }
        return this.profileRepository.save(profile);
    }

    async getProfileInterests(
        userProfile: ProfileEntity,
    ): Promise<InterestEntity[]> {
        const profile = await this.profileRepository.findOne(userProfile);
        return profile.interests;
    }
}
