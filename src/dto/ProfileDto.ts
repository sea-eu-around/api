import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../common/dto/AbstractDto';
import { ProfileEntity } from '../entities/profile.entity';
import { UtilsService } from '../providers/utils.service';
import { InterestDto } from './InterestDto';
import { LanguageDto } from './LanguageDto';

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

    constructor(profile: ProfileEntity) {
        super(profile);
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.university = profile.university;
        this.languages = UtilsService.isDtos(profile.languages)
            ? profile.languages.toDtos()
            : profile.languages;
        this.interests = UtilsService.isDtos(profile.interests)
            ? profile.interests.toDtos()
            : profile.interests;
    }
}
