/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';

import { ProfileType } from '../../common/constants/profile-type';
import { StaffProfileEntity } from '../../entities/staffProfile.entity';
import { StudentProfileEntity } from '../../entities/studentProfile.entity';
import { UserEntity } from '../../entities/user.entity';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { ProfileCreationDto } from './dto/ProfileCreationDto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly _studentProfileRepository: StudentProfileRepository,
        private readonly _staffProfileRepository: StaffProfileRepository,
    ) {}

    async createProfile(
        profileCreationDto: ProfileCreationDto,
        type: ProfileType,
        user: UserEntity,
    ): Promise<StudentProfileEntity | StaffProfileEntity> {
        if (type === ProfileType.STUDENT) {
            const profile = this._studentProfileRepository.create();
            Object.assign(profile, profileCreationDto);
            profile.user = user;

            return this._studentProfileRepository.save(profile);
        }
        {
            const profile = this._staffProfileRepository.create();
            Object.assign(profile, profileCreationDto);
            profile.user = user;

            return this._staffProfileRepository.save(profile);
        }
    }
}
