import { ChildEntity } from 'typeorm';

import { ProfileType } from '../common/constants/profile-type';
import { StaffProfileDto } from '../dto/StaffProfileDto';
import { ProfileEntity } from './profile.entity';

@ChildEntity(ProfileType.STAFF)
export class StaffProfileEntity extends ProfileEntity {
    dtoClass = StaffProfileDto;
}
