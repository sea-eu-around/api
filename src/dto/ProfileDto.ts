import { ApiPropertyOptional } from '@nestjs/swagger';
import { GenderType } from 'aws-sdk/clients/rekognition';

import { NationalityType } from '../common/constants/nationality-type';
import { ProfileType } from '../common/constants/profile-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { ProfileEntity } from '../entities/profile.entity';
import { UtilsService } from '../providers/utils.service';
import { EducationFieldDto } from './EducationFieldDto';
import { InterestDto } from './InterestDto';
import { LanguageDto } from './LanguageDto';
import { ProfileOfferDto } from './ProfileOfferDto';

export class ProfileDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    id: string;

    @ApiPropertyOptional()
    type?: ProfileType;

    @ApiPropertyOptional()
    firstName: string;

    @ApiPropertyOptional()
    lastName: string;

    @ApiPropertyOptional()
    university: string;

    @ApiPropertyOptional()
    languages: LanguageDto[];

    @ApiPropertyOptional()
    interests: InterestDto[];

    @ApiPropertyOptional()
    educationFields: EducationFieldDto[];

    @ApiPropertyOptional()
    profileOffers: ProfileOfferDto[];

    @ApiPropertyOptional()
    birthdate: Date;

    @ApiPropertyOptional()
    gender: GenderType;

    @ApiPropertyOptional()
    nationality: NationalityType;

    @ApiPropertyOptional()
    avatar?: string;

    constructor(profile: ProfileEntity) {
        super();
        this.id = profile.id;
        this.type = profile.type;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.university = profile.university;
        this.birthdate = profile.birthdate;
        this.gender = profile.gender;
        this.nationality = profile.nationality;
        this.avatar = profile.avatar;
        this.educationFields = UtilsService.isDtos(profile.educationFields)
            ? profile.educationFields.toDtos()
            : profile.educationFields;
        this.languages = UtilsService.isDtos(profile.languages)
            ? profile.languages.toDtos()
            : profile.languages;
        this.interests = UtilsService.isDtos(profile.interests)
            ? profile.interests.toDtos()
            : profile.interests;
        this.profileOffers = UtilsService.isDtos(profile.profileOffers)
            ? profile.profileOffers.toDtos()
            : profile.profileOffers;
    }
}
