import { Injectable } from '@nestjs/common';
import { map } from 'lodash';
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
        const test = await this.interestRepository.findOne({ name });
        if (!test) {
            const interest = this.interestRepository.create({ name });
            return this.interestRepository.save(interest);
        }
        return test;
    }

    async addInterestToProfile(
        profileId: string,
        interestIds: string[],
    ): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findOneOrFail(profileId);
        const interests = [];

        for (const id of map(interestIds)) {
            const interest = this.interestRepository.findOneOrFail(id);
            interests.push(interest);
        }
        const interestsList = await Promise.all(interests);

        for (const interest of interestsList) {
            if (!profile.interests.includes(interest)) {
                profile.interests.push(interest);
            }
        }
        return this.profileRepository.save(profile);
    }

    async getAllInterests(): Promise<InterestEntity[]> {
        return this.interestRepository.find();
    }

    async getProfileInterests(profileId: string): Promise<InterestEntity[]> {
        const profile = await this.profileRepository.findOneOrFail(profileId);
        return profile.interests;
    }
}
