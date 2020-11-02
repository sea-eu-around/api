/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';

import { ProfileType } from '../../common/constants/profile-type';
import { ProfileEntity } from '../../entities/profile.entity';
import { StaffProfileEntity } from '../../entities/staffProfile.entity';
import { StudentProfileEntity } from '../../entities/studentProfile.entity';
import { UserEntity } from '../../entities/user.entity';
import { InterestRepository } from '../../repositories/interest.repository';
import { LanguageRepository } from '../../repositories/language.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileOfferRepository } from '../../repositories/profileOffer.repository';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { AddInterestsToProfileDto } from './dto/AddInterestsToProfileDto';
import { AddLanguageToProfileDto } from './dto/AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './dto/AddOfferToProfileDto';
import { StaffProfileCreationDto } from './dto/StaffProfileCreationDto';
import { StudentProfileCreationDto } from './dto/StudentProfileCreationDto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly _studentProfileRepository: StudentProfileRepository,
        private readonly _staffProfileRepository: StaffProfileRepository,
        private readonly _profileRepository: ProfileRepository,
        private readonly _interestRepository: InterestRepository,
        private readonly _languageRepository: LanguageRepository,
        private readonly _profileOfferRepository: ProfileOfferRepository,
    ) {}

    async findOneById(id: string): Promise<ProfileEntity> {
        return this._profileRepository.findOneOrFail({ id });
    }

    async create(
        profileCreationDto: StaffProfileCreationDto | StudentProfileCreationDto,
        type: ProfileType,
        user: UserEntity,
    ): Promise<StudentProfileEntity | StaffProfileEntity | ProfileEntity> {
        let savedProfile:
            | StudentProfileEntity
            | StaffProfileEntity
            | ProfileEntity;
        if (type === ProfileType.STUDENT) {
            const profile = this._studentProfileRepository.create();
            Object.assign(profile, profileCreationDto);
            delete profile.languages;
            profile.user = user;

            savedProfile = await this._studentProfileRepository.save(profile);
        } else {
            const profile = this._staffProfileRepository.create();
            Object.assign(profile, profileCreationDto);
            profile.user = user;

            savedProfile = await this._staffProfileRepository.save(profile);
        }

        if (profileCreationDto.languages) {
            savedProfile = await this.addLanguages(
                profileCreationDto.languages,
                savedProfile.id,
            );
        }

        if (profileCreationDto.interests) {
            savedProfile = await this.addInterests(
                <AddInterestsToProfileDto>{
                    interests: profileCreationDto.interests,
                },
                savedProfile.id,
            );
        }

        if (profileCreationDto.profileOffers) {
            savedProfile = await this.addOffers(
                profileCreationDto.profileOffers,
                savedProfile.id,
            );
        }

        return savedProfile;
    }

    async addInterests(
        addInterestsToProfileDto: AddInterestsToProfileDto,
        profileId?: string,
        user?: UserEntity,
    ): Promise<ProfileEntity> {
        const profile = await this._profileRepository.findOneOrFail({
            id: profileId || user.profileId,
        });

        const interests = await this._interestRepository.findByIds(
            addInterestsToProfileDto.interests,
        );

        profile.interests = interests;

        return this._profileRepository.save(profile);
    }

    async addLanguages(
        addLanguagesToProfileDto: AddLanguageToProfileDto[],
        profileId?: string,
        user?: UserEntity,
    ): Promise<ProfileEntity> {
        const profile = await this._profileRepository.findOneOrFail({
            id: profileId || user.profileId,
        });

        profile.languages = addLanguagesToProfileDto.map((language) =>
            Object.assign(this._languageRepository.create(), {
                ...language,
                profile: profileId || user.profileId,
            }),
        );

        return this._profileRepository.save(profile);
    }

    async addOffers(
        addOffersToProfileDto: AddOfferToProfileDto[],
        profileId?: string,
        user?: UserEntity,
    ): Promise<ProfileEntity> {
        const profile = await this._profileRepository.findOneOrFail({
            id: profileId || user.profileId,
        });

        profile.profileOffers = addOffersToProfileDto.map((profileOffer) =>
            Object.assign(this._profileOfferRepository.create(), {
                ...profileOffer,
                profileId: profileId || user.profileId,
            }),
        );

        return this._profileRepository.save(profile);
    }
}
