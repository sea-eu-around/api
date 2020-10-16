import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { LanguageLevelType } from '../common/constants/language-level-type';
import { LanguageEntity } from './language.entity';
import { ProfileEntity } from './profile.entity';

@Entity('profile_language')
export class ProfileLanguageEntity {
    @Column()
    profileId: string;

    @Column()
    languageId: string;

    @Column({ enum: LanguageLevelType, type: 'enum' })
    level: LanguageLevelType;

    @PrimaryColumn({ type: 'uuid', name: 'profileId' })
    @ManyToOne(() => ProfileEntity, (profile) => profile.profileLanguages, {
        primary: true,
    })
    profile: ProfileEntity;

    @PrimaryColumn({ type: 'uuid', name: 'languageId' })
    @ManyToOne(() => LanguageEntity, (language) => language.profileLanguages, {
        primary: true,
    })
    language: LanguageEntity;
}
