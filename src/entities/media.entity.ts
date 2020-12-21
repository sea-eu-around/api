import {
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    TableInheritance,
} from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { MediaType } from '../common/constants/media-type';
import { MediaDto } from '../dto/MediaDto';
import { ProfileEntity } from './profile.entity';

@Entity('media')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: MediaType } })
export class MediaEntity extends AbstractCompositeEntity<MediaDto> {
    @Column()
    @PrimaryColumn()
    id: string;

    @Column()
    path: string;

    @ManyToOne(() => ProfileEntity, { onDelete: 'CASCADE' })
    creator: ProfileEntity;

    @Column()
    creatorId;

    dtoClass = MediaDto;
}
