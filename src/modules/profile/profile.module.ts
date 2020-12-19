import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IsSEAEmailConstraint } from '../../decorators/validators.decorator';
import { EducationFieldRepository } from '../../repositories/educationField.repository';
import { InterestRepository } from '../../repositories/interest.repository';
import { LanguageRepository } from '../../repositories/language.repository';
import { MatchingRepository } from '../../repositories/matching.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileOfferRepository } from '../../repositories/profileOffer.repository';
import { ProfilePictureRepository } from '../../repositories/profilePicture.repository';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StaffRoleRepository } from '../../repositories/staffRole.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { WhitelistedEmailRepository } from '../../repositories/whitelistedEmail.repository';
import { MatchingModule } from '../matching/matching.module';
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
            MatchingRepository,
            StaffRoleRepository,
            ProfilePictureRepository,
        ]),
        forwardRef(() => MatchingModule),
    ],
    controllers: [ProfileController],
    exports: [ProfileService],
    providers: [ProfileService, IsSEAEmailConstraint],
})
export class ProfileModule {}
