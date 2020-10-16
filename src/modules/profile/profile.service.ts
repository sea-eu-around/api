/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';

import { ProfileType } from '../../common/constants/profile-type';
import { StaffProfileDto } from '../../dto/StaffProfileDto';
import { StudentProfileDto } from '../../dto/StudentProfileDto';
import { StaffProfileEntity } from '../../entities/staffProfile.entity';
import { StudentProfileEntity } from '../../entities/studentProfile.entity';
import { UserEntity } from '../../entities/user.entity';
import { LanguageRepository } from '../../repositories/language.repository';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';

@Injectable()
export class ProfileService {
    constructor(
        private readonly _studentProfileRepository: StudentProfileRepository,
        private readonly _staffProfileRepository: StaffProfileRepository,
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
            await this._languageRepository.save(
                savedProfile.languages.map((language) =>
                    Object.assign(this._languageRepository.create(), {
                        ...language,
                        profile: savedProfile.id,
                    }),
                ),
            );
        }

        return savedProfile;
    }
}
