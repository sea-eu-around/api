import { TeacherProfileEntity } from '../entities/teacherProfile.entity';
import { ProfileDto } from './ProfileDto';

export class TeacherProfileDto extends ProfileDto {
    constructor(profile: TeacherProfileEntity) {
        super(profile);
    }
}
