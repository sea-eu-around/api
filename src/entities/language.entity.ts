import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { LanguageType } from '../common/constants/language-type';
import { LanguageDto } from '../dto/LanguageDto';
import { ProfileLanguageEntity } from './profileLanguage.entity';

@Entity('language')
export class LanguageEntity extends AbstractEntity<LanguageDto> {
    @Column({ type: 'varchar' })
    name: string;

    @Column({ enum: LanguageType, type: 'enum' })
    code: LanguageType;

    @OneToMany(
        () => ProfileLanguageEntity,
        (profileToLanguage) => profileToLanguage.language,
    )
    profileLanguages: ProfileLanguageEntity[];

    dtoClass = LanguageDto;
}
