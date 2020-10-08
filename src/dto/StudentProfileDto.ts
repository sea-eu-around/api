import { StudentProfileEntity } from '../entities/studentProfile.entity';
import { ProfileDto } from './ProfileDto';

export class StudentProfileDto extends ProfileDto {
    constructor(profile: StudentProfileEntity) {
        super(profile);
    }
}
