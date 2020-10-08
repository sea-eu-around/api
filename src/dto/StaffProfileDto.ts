import { StaffProfileEntity } from '../entities/staffProfile.entity';
import { ProfileDto } from './ProfileDto';

export class StaffProfileDto extends ProfileDto {
    constructor(profile: StaffProfileEntity) {
        super(profile);
    }
}
