import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { LanguageLevelType } from '../common/constants/language-level-type';
import { LanguageType } from '../common/constants/language-type';
import { LanguageDto } from '../dto/LanguageDto';
import { ProfileEntity } from './profile.entity';

@Entity('language')
export class LanguageEntity extends AbstractCompositeEntity<LanguageDto> {
    @PrimaryColumn({ type: 'enum', name: 'code' })
    @Column({ enum: LanguageType, type: 'enum', primary: true })
    code: LanguageType;

    @Column({ enum: LanguageLevelType, type: 'enum', nullable: true })
    level: LanguageLevelType;

    @PrimaryColumn({ type: 'uuid', name: 'profile_id' })
    @ManyToOne(() => ProfileEntity, (profile) => profile.languages, {
        primary: true,
        cascade: true,
    })
    profile: ProfileEntity;

    dtoClass = LanguageDto;
}
