import { Column, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ProfileDto } from '../../dto/ProfileDto';
import { UserEntity } from '../user.entity';

export class ProfileEntity extends AbstractEntity<ProfileDto> {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username: string;

    @Column()
    city: string;

    @Column()
    university: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    dtoClass = ProfileDto;
}
