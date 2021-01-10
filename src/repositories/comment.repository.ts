import { EntityRepository, TreeRepository } from 'typeorm';

import { CommentEntity } from '../entities/comment.entity';
@EntityRepository(CommentEntity)
export class CommentRepository extends TreeRepository<CommentEntity> {}
