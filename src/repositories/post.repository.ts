import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { PostEntity } from '../entities/post.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {}
