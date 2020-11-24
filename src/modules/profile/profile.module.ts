import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IsSEAEmailConstraint } from '../../decorators/validators.decorator';
import { EducationFieldRepository } from '../../repositories/educationField.repository';
import { InterestRepository } from '../../repositories/interest.repository';
import { LanguageRepository } from '../../repositories/language.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileOfferRepository } from '../../repositories/profileOffer.repository';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { WhitelistedEmailRepository } from '../../repositories/whitelistedEmail.repository';
import { UserRepository } from '../user/user.repository';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            StudentProfileRepository,
            StaffProfileRepository,
            ProfileRepository,
            LanguageRepository,
            InterestRepository,
            ProfileOfferRepository,
            EducationFieldRepository,
            UserRepository,
            WhitelistedEmailRepository,
        ]),
    ],
    controllers: [ProfileController],
    exports: [ProfileService],
    providers: [ProfileService, IsSEAEmailConstraint],
})
export class ProfileModule {}
