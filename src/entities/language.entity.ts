import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { LanguageLevelType } from '../common/constants/language-level-type';
import { LanguageType } from '../common/constants/language-type';
import { LanguageDto } from '../dto/LanguageDto';
import { ProfileEntity } from './profile.entity';

@Entity('language')
export class LanguageEntity extends AbstractCompositeEntity<LanguageDto> {
    @Column({ enum: LanguageType, type: 'enum' })
    @PrimaryColumn()
    code!: LanguageType;

    @Column()
    @PrimaryColumn()
    profileId!: string;

    @Column({ enum: LanguageLevelType, type: 'enum', nullable: true })
    level: LanguageLevelType;

    @ManyToOne(() => ProfileEntity, (profile) => profile.languages, {
        onDelete: 'CASCADE',
    })
    profile: ProfileEntity;

    dtoClass = LanguageDto;
}
