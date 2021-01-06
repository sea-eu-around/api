import { SimplePostEntity } from '../entities/simplePost.entity';
import { PostDto } from './PostDto';

export class SimplePostDto extends PostDto {
    constructor(post: SimplePostEntity) {
        super(post);
    }
}
