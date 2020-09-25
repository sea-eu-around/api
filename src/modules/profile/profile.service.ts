/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';

import { ProfileType } from '../../common/constants/profile-type';
import { StudentProfileEntity } from '../../entities/studentProfile.entity';
import { TeacherProfileEntity } from '../../entities/teacherProfile.entity';
import { UserEntity } from '../../entities/user.entity';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { TeacherProfileRepository } from '../../repositories/teacherProfile.repository';
import { ProfileCreationDto } from './dto/ProfileCreationDto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly _studentProfileRepository: StudentProfileRepository,
        private readonly _teacherProfileRepository: TeacherProfileRepository,
    ) {}

    async createProfile(
        profileCreationDto: ProfileCreationDto,
        type: ProfileType,
        user: UserEntity,
    ): Promise<StudentProfileEntity | TeacherProfileEntity> {
        const profileRepository =
            type === ProfileType.STUDENT
                ? this._studentProfileRepository
                : this._teacherProfileRepository;

        const profile = profileRepository.create();
        Object.assign(profile, profileCreationDto);
        profile.user = user;

        return profileRepository.save(profile);
    }
}
