import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { EducationFieldType } from '../common/constants/education-field-type';
import { EducationFieldDto } from '../dto/EducationFieldDto';
import { ProfileEntity } from './profile.entity';

@Entity('education_field')
export class EducationFieldEntity extends AbstractCompositeEntity<
    EducationFieldDto
> {
    @PrimaryColumn({ type: 'enum', name: 'id' })
    @Column({ enum: EducationFieldType, type: 'enum', primary: true })
    id: EducationFieldType;

    @PrimaryColumn({ type: 'uuid', name: 'profile_id' })
    @ManyToOne(() => ProfileEntity, (profile) => profile.educationFields, {
        primary: true,
    })
    profile: ProfileEntity;

    dtoClass = EducationFieldDto;
}
