/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';

import { ProfileType } from '../../common/constants/profile-type';
import { LanguageDto } from '../../dto/LanguageDto';
import { StaffProfileDto } from '../../dto/StaffProfileDto';
import { StudentProfileDto } from '../../dto/StudentProfileDto';
import { ProfileEntity } from '../../entities/profile.entity';
import { StaffProfileEntity } from '../../entities/staffProfile.entity';
import { StudentProfileEntity } from '../../entities/studentProfile.entity';
import { UserEntity } from '../../entities/user.entity';
import { InterestRepository } from '../../repositories/interest.repository';
import { LanguageRepository } from '../../repositories/language.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { AddInterestToProfileDto } from './dto/AddInterestToProfileDto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly _studentProfileRepository: StudentProfileRepository,
        private readonly _staffProfileRepository: StaffProfileRepository,
        private readonly _profileRepository: ProfileRepository,
        private readonly _interestRepository: InterestRepository,
        private readonly _languageRepository: LanguageRepository,
    ) {}

    async createProfile(
        profileCreationDto: StudentProfileDto | StaffProfileDto,
        type: ProfileType,
        user: UserEntity,
    ): Promise<StudentProfileEntity | StaffProfileEntity> {
        let savedProfile: StudentProfileEntity | StaffProfileEntity;

        if (type === ProfileType.STUDENT) {
            const profile = this._studentProfileRepository.create();
            Object.assign(profile, profileCreationDto);
            profile.user = user;

            savedProfile = await this._studentProfileRepository.save(profile);
        } else {
            const profile = this._staffProfileRepository.create();
            Object.assign(profile, profileCreationDto);
            profile.user = user;

            savedProfile = await this._staffProfileRepository.save(profile);
        }

        if (savedProfile.languages) {
            await this.addLanguagesToProfile(
                savedProfile.languages,
                savedProfile.id,
            );
        }

        return savedProfile;
    }

    async addInterestToProfile(
        addInterestToProfile: AddInterestToProfileDto,
        user: UserEntity,
    ): Promise<ProfileEntity> {
        const profile = await this._profileRepository.findOneOrFail({ user });
        const interests = await this._interestRepository.findByIds(
            addInterestToProfile.interestIds,
        );

        profile.interests = interests;

        return this._profileRepository.save(profile);
    }

    async addLanguagesToProfile(
        languages: LanguageDto[],
        profileId: string,
    ): Promise<void> {
        await this._languageRepository.save(
            languages.map((language) =>
                Object.assign(this._languageRepository.create(), {
                    ...language,
                    profile: profileId,
                }),
            ),
        );
    }
}
