import { ApiPropertyOptional } from '@nestjs/swagger';
import { GenderType } from 'aws-sdk/clients/rekognition';

import { EducationFieldType } from '../common/constants/education-field-type';
import { NationalityType } from '../common/constants/nationality-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { ProfileEntity } from '../entities/profile.entity';
import { UtilsService } from '../providers/utils.service';
import { InterestDto } from './InterestDto';
import { LanguageDto } from './LanguageDto';
import { ProfileOfferDto } from './ProfileOfferDto';

export class ProfileDto extends AbstractDto {
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
    educationField: EducationFieldType;

    @ApiPropertyOptional()
    profileOffers: ProfileOfferDto[];

    @ApiPropertyOptional()
    birthdate: Date;

    @ApiPropertyOptional()
    gender: GenderType;

    @ApiPropertyOptional()
    nationality: NationalityType;

    constructor(profile: ProfileEntity) {
        super(profile);
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.university = profile.university;
        this.educationField = profile.educationField;
        this.birthdate = profile.birthdate;
        this.gender = profile.gender;
        this.nationality = profile.nationality;
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
