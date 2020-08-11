import { UserEntity } from '../user.entity';

export interface IProfile {
    firstName: string;

    lastName: string;

    username: string;

    city: string;

    university: string;

    user: UserEntity;
}
