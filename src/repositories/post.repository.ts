import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { PostEntity } from '../entities/post.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
    async isEmpty({ groupId }: { groupId: string }): Promise<boolean> {
        const post = await this.findOne({ groupId });
        if (post) {
            return false;
        }
        return true;
    }
}
