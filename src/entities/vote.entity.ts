import { Transform } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

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

    dtoClass = VoteDto;
}
