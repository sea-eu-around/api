import { Transform } from 'class-transformer';
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Column,
    Entity,
    getConnection,
    ManyToOne,
} from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { VoteType } from '../common/constants/vote-type';
import { VoteEntityType } from '../common/constants/voteEntityType';
import { VoteDto } from '../dto/VoteDto';
import { PolymorphicParent } from '../polymorphic/decorators';
import { PolymorphicChildInterface } from '../polymorphic/polymorphic.interface';
import { CommentEntity } from './comment.entity';
import { PostEntity } from './post.entity';
import { ProfileEntity } from './profile.entity';

@Entity('vote')
export abstract class VoteEntity
    extends AbstractEntity<VoteDto>
    implements PolymorphicChildInterface {
    @Column({ type: 'enum', enum: VoteType })
    voteType: VoteType;

    @ManyToOne(() => ProfileEntity, (profile) => profile.votes, {
        onDelete: 'CASCADE',
    })
    fromProfile: ProfileEntity;

    @PolymorphicParent(() => [PostEntity, CommentEntity])
    @Transform(
        (value: PostEntity | CommentEntity) => ({
            ...value,
            type: value.constructor.name,
        }),
        {
            toPlainOnly: true,
        },
    )
    entity: PostEntity | CommentEntity;

    @Column()
    entityId: string;

    @Column({ type: 'enum', enum: VoteEntityType })
    entityType: VoteEntityType;

    @Column()
    fromProfileId: string;

    @AfterInsert()
    async increaseLikesCounter(): Promise<void> {
        const id = this.entityId != null ? this.entityId : 0;
        const query =
            this.voteType === VoteType.UP
                ? '" SET "up_votes_count" = up_votes_count + 1 WHERE "id" = $1'
                : '" SET "down_votes_count" = down_votes_count + 1 WHERE "id" = $1'; // To avoid updated_at to be changed
        await getConnection().query('UPDATE "' + this.entityType + query, [id]);
    }

    @AfterUpdate()
    async updateLikesCounter(): Promise<void> {
        const id = this.entityId != null ? this.entityId : 0;
        const query =
            this.voteType === VoteType.UP
                ? '" SET "up_votes_count" = up_votes_count + 1, "down_votes_count" = down_votes_count - 1 WHERE "id" = $1'
                : '" SET "down_votes_count" = down_votes_count + 1, "up_votes_count" = up_votes_count - 1 WHERE "id" = $1';
        await getConnection().query('UPDATE "' + this.entityType + query, [id]);
    }

    @AfterRemove()
    async decreaseLikesCounter(): Promise<void> {
        const id = this.entityId != null ? this.entityId : 0;
        const query =
            this.voteType === VoteType.UP
                ? '" SET "up_votes_count" = up_votes_count - 1 WHERE "id" = $1'
                : '" SET "down_votes_count" = down_votes_count - 1 WHERE "id" = $1';
        // To avoid updated_at to be changed
        await getConnection().query('UPDATE "' + this.entityType + query, [id]);
    }
    dtoClass = VoteDto;
}
