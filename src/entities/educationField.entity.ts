import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { EducationFieldType } from '../common/constants/education-field-type';
import { EducationFieldDto } from '../dto/EducationFieldDto';
import { ProfileEntity } from './profile.entity';

@Entity('education_field')
export class EducationFieldEntity extends AbstractCompositeEntity<
    EducationFieldDto
> {
    @Index()
    @Column({ enum: EducationFieldType, type: 'enum' })
    @PrimaryColumn({ enum: EducationFieldType, type: 'enum' })
    id: EducationFieldType;

    @Index()
    @Column()
    @PrimaryColumn()
    profileId: string;

    @ManyToOne(() => ProfileEntity, (profile) => profile.educationFields)
    profile: ProfileEntity;

    dtoClass = EducationFieldDto;
}
