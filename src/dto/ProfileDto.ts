import { AbstractDto } from '../common/dto/AbstractDto';
import { ProfileEntity } from '../entities/profile.entity';
import { UserDto } from './UserDto';

export class ProfileDto extends AbstractDto {
    firstName: string;

    lastName: string;

    university: string;

    user: UserDto;

    constructor(profile: ProfileEntity) {
        super(profile);
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.university = profile.university;
        this.user = profile.user.toDto();
    }
}
