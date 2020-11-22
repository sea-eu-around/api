import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { RoleType } from '../common/constants/role-type';
import { UserDto } from '../dto/UserDto';
import { MatchingEntity } from './matching.entity';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @OneToOne(() => ProfileEntity, (profile) => profile.user)
    profile: ProfileEntity;

    @Column({ nullable: false, default: false })
    isVerified: boolean;

    @Column({ nullable: false, default: false })
    onboarded: boolean;

    @OneToMany(() => MatchingEntity, (matching) => matching.fromUser, {
        cascade: true,
    })
    givenLikes: MatchingEntity[];

    @OneToMany(() => MatchingEntity, (matching) => matching.fromUser, {
        cascade: true,
    })
    receivedLikes: MatchingEntity[];

    // TODO: remove
    verificationToken?: string;

    dtoClass = UserDto;
}
