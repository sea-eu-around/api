import { Transform } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { ReportType } from '../common/constants/report-type';
import { ReportDto } from '../dto/ReportDto';
import { PolymorphicParent } from '../polymorphic/decorators';
import { PolymorphicChildInterface } from '../polymorphic/polymorphic.interface';
import { CommentEntity } from './comment.entity';
import { GroupEntity } from './group.entity';
import { MatchingEntity } from './matching.entity';
import { PostEntity } from './post.entity';
import { ProfileEntity } from './profile.entity';

@Entity('report')
export class ReportEntity
    extends AbstractCompositeEntity<ReportDto>
    implements PolymorphicChildInterface {
    @Column({ enum: ReportType, type: 'enum' })
    @PrimaryColumn()
    type!: ReportType;

    @Column()
    @PrimaryColumn()
    profileId!: string;

    @ManyToOne(() => ProfileEntity, (profile) => profile.reports, {
        onDelete: 'CASCADE',
    })
    profile: ProfileEntity;

    @PolymorphicParent(() => [
        ProfileEntity,
        MatchingEntity,
        PostEntity,
        CommentEntity,
    ])
    @Transform(
        (
            value:
                | ProfileEntity
                | MatchingEntity
                | GroupEntity
                | PostEntity
                | CommentEntity,
        ) => ({
            ...value,
            type: value.constructor.name,
        }),
        {
            toPlainOnly: true,
        },
    )
    entity:
        | ProfileEntity
        | MatchingEntity
        | GroupEntity
        | PostEntity
        | CommentEntity;

    @Column()
    @PrimaryColumn()
    entityId!: string;

    @Column()
    @PrimaryColumn()
    entityType!: string;

    dtoClass = ReportDto;
}
