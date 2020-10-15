import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { LanguageLevelType } from '../common/constants/language-level-type';
import { ProfileToLanguageDto } from '../dto/ProfileToLanguageDto';
import { LanguageEntity } from './language.entity';
import { ProfileEntity } from './profile.entity';

@Entity('profileToLanguage')
export class ProfileToLanguageEntity extends AbstractEntity<
    ProfileToLanguageDto
> {
    @Column()
    profileId: string;

    @Column()
    languageId: string;

    @Column({ enum: LanguageLevelType, type: 'enum' })
    level: LanguageLevelType;

    @ManyToOne(() => ProfileEntity, (profile) => profile.profileToLanguages)
    profile: ProfileEntity;

    @ManyToOne(() => LanguageEntity, (language) => language.profileToLanguages)
    language: LanguageEntity;

    dtoClass = ProfileToLanguageDto;
}
