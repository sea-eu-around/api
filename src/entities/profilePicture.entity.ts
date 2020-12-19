import { ChildEntity, Column, ManyToOne } from 'typeorm';

import { MediaType } from '../common/constants/media-type';
import { MediaEntity } from './media.entity';
import { ProfileEntity } from './profile.entity';

@ChildEntity(MediaType.PROFILE_PICTURE)
export class ProfilePictureEntity extends MediaEntity {
    @ManyToOne(() => ProfileEntity)
    profile: ProfileEntity;

    @Column()
    profileId;
}
