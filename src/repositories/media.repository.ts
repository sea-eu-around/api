import { EntityRepository, Repository } from 'typeorm';

import { MediaEntity } from '../entities/media.entity';

@EntityRepository(MediaEntity)
export class MediaRepository extends Repository<MediaEntity> {}
