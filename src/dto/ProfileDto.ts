import { AbstractDto } from '../common/dto/AbstractDto';
import { ProfileEntity } from '../entities/profile.entity';

export class ProfileDto extends AbstractDto {
    firstName: string;
    lastName: string;
    university: string;

    constructor(profile: ProfileEntity) {
        super(profile);
        this.firstName = profile.firstName;
    }
}
