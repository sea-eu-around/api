import { ChildEntity } from 'typeorm';

import { MediaType } from '../common/constants/media-type';
import { MediaEntity } from './media.entity';

@ChildEntity(MediaType.PROFILE_PICTURE)
export class ProfilePictureEntity extends MediaEntity {}
