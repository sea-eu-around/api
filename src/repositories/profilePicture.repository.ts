import { EntityRepository, Repository } from 'typeorm';

import { ProfilePictureEntity } from '../entities/profilePicture.entity';

@EntityRepository(ProfilePictureEntity)
export class ProfilePictureRepository extends Repository<ProfilePictureEntity> {}
