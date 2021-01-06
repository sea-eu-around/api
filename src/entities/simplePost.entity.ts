import { ChildEntity } from 'typeorm';

import { PostType } from '../common/constants/post-type';
import { SimplePostDto } from '../dto/SimplePostDto';
import { PostEntity } from './post.entity';

@ChildEntity(PostType.SIMPLE)
export class SimplePostEntity extends PostEntity {
    dtoClass = SimplePostDto;
}
