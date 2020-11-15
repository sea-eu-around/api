/* eslint-disable complexity */
import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { DegreeType } from '../../common/constants/degree-type';
import { LanguageType } from '../../common/constants/language-type';
import { ProfileType } from '../../common/constants/profile-type';
import {
    PARTNER_UNIVERSITIES,
    PartnerUniversity,
} from '../../common/constants/sea';
import { EducationFieldEntity } from '../../entities/educationField.entity';
import { InterestEntity } from '../../entities/interest.entity';
import { LanguageEntity } from '../../entities/language.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { ProfileOfferEntity } from '../../entities/profileOffer.entity';
import { StaffProfileEntity } from '../../entities/staffProfile.entity';
import { StudentProfileEntity } from '../../entities/studentProfile.entity';
import { UserEntity } from '../../entities/user.entity';
import { EducationFieldRepository } from '../../repositories/educationField.repository';
import { InterestRepository } from '../../repositories/interest.repository';
import { LanguageRepository } from '../../repositories/language.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileOfferRepository } from '../../repositories/profileOffer.repository';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { AddEducationFieldToProfileDto } from './dto/AddEducationFieldToProfileDto';
import { AddInterestsToProfileDto } from './dto/AddInterestsToProfileDto';
import { AddLanguageToProfileDto } from './dto/AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './dto/AddOfferToProfileDto';
import { ProfileCreationDto } from './dto/ProfileCreationDto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly _studentProfileRepository: StudentProfileRepository,
        private readonly _staffProfileRepository: StaffProfileRepository,
        private readonly _profileRepository: ProfileRepository,
        private readonly _interestRepository: InterestRepository,
        private readonly _languageRepository: LanguageRepository,
        private readonly _profileOfferRepository: ProfileOfferRepository,
        private readonly _educationFieldRepository: EducationFieldRepository,
    ) {}

    async findOneById(id: string): Promise<ProfileEntity> {
        return this._profileRepository.findOneOrFail({ id });
    }

    async getProfiles(
        universities: PartnerUniversity[],
        spokenLanguages: LanguageType[],
        degrees: DegreeType[],
        options: IPaginationOptions,
    ): Promise<Pagination<ProfileEntity>> {
        const profiles = this._profileRepository
            .createQueryBuilder('profile')
            .leftJoinAndSelect('profile.languages', 'languages')
            .where('profile.university IN (:...universities)', {
                universities: _.isArray(universities)
                    ? universities
                    : [universities],
            })
            .andWhere('profile.degree IN (:...degrees)', {
                degrees: _.isArray(degrees) ? degrees : [degrees],
            })
            .andWhere('languages.code IN (:...spokenLanguages)', {
                spokenLanguages: _.isArray(spokenLanguages)
                    ? spokenLanguages
                    : [spokenLanguages],
            });

        return paginate<ProfileEntity>(profiles, options);
    }

    async createOrUpdate(
        profileCreationDto: ProfileCreationDto,
        user: UserEntity,
    ): Promise<StudentProfileEntity | StaffProfileEntity | ProfileEntity> {
        let savedProfile:
            | StudentProfileEntity
            | StaffProfileEntity
            | ProfileEntity;

        let profile: StudentProfileEntity | StaffProfileEntity | ProfileEntity =
            (await this._profileRepository.findOne(user.id)) || null;

        const type =
            profile && profile instanceof StudentProfileEntity
                ? ProfileType.STUDENT
                : profile && profile instanceof StaffProfileEntity
                ? ProfileType.STAFF
                : profileCreationDto.type;

        if (type === ProfileType.STUDENT) {
            profile = profile || this._studentProfileRepository.create();
            profile.university = ProfileService._findUnivFromEmail(user.email);

            Object.assign(profile, profileCreationDto);

            delete profile.languages;
            delete profile.profileOffers;
            delete profile.educationFields;
            profile.user = user;

            savedProfile = await this._studentProfileRepository.save(profile);
        } else {
            profile = profile || this._staffProfileRepository.create();
            profile.university = ProfileService._findUnivFromEmail(user.email);

            Object.assign(profile, profileCreationDto);

            delete profile.languages;
            delete profile.profileOffers;
            delete profile.educationFields;
            profile.user = user;

            savedProfile = await this._staffProfileRepository.save(profile);
        }

        if (profileCreationDto.languages) {
            savedProfile.languages = await this.addLanguages(
                profileCreationDto.languages,
                savedProfile.id,
            );
        }

        if (profileCreationDto.interests) {
            savedProfile.interests = await this.addInterests(
                <AddInterestsToProfileDto>{
                    interests: profileCreationDto.interests,
                },
                savedProfile.id,
            );
        }

        if (profileCreationDto.profileOffers) {
            savedProfile.profileOffers = await this.addOffers(
                profileCreationDto.profileOffers,
                savedProfile.id,
            );
        }

        if (profileCreationDto.educationFields) {
            savedProfile.educationFields = await this.addEducationFields(
                profileCreationDto.educationFields,
                savedProfile.id,
            );
        }

        return savedProfile;
    }

    async addInterests(
        addInterestsToProfileDto: AddInterestsToProfileDto,
        profileId?: string,
        user?: UserEntity,
    ): Promise<InterestEntity[]> {
        const interests = addInterestsToProfileDto.interests.map((id) =>
            Object.assign(this._interestRepository.create(), {
                id,
                profile: profileId || user.id,
            }),
        );

        return this._interestRepository.save(interests);
    }

    async addLanguages(
        addLanguagesToProfileDto: AddLanguageToProfileDto[],
        profileId?: string,
        user?: UserEntity,
    ): Promise<LanguageEntity[]> {
        const languages = addLanguagesToProfileDto.map((language) =>
            Object.assign(this._languageRepository.create(), {
                ...language,
                profile: profileId || user.id,
            }),
        );

        return this._languageRepository.save(languages);
    }

    async addOffers(
        addOffersToProfileDto: AddOfferToProfileDto[],
        profileId?: string,
        user?: UserEntity,
    ): Promise<ProfileOfferEntity[]> {
        const profileOffers = addOffersToProfileDto.map((profileOffer) =>
            Object.assign(this._profileOfferRepository.create(), {
                ...profileOffer,
                profileId: profileId || user.id,
            }),
        );

        return this._profileOfferRepository.save(profileOffers);
    }

    async addEducationFields(
        addEducationFieldsToProfileDto: AddEducationFieldToProfileDto[],
        profileId?: string,
        user?: UserEntity,
    ): Promise<EducationFieldEntity[]> {
        const educationFields = addEducationFieldsToProfileDto.map(
            (educationField) =>
                Object.assign(this._educationFieldRepository.create(), {
                    ...educationField,
                    profile: profileId || user.id,
                }),
        );

        return this._educationFieldRepository.save(educationFields);
    }

    private static _findUnivFromEmail(email: string) {
        const domain = email.split('@')[1];

        const university = PARTNER_UNIVERSITIES.find(
            (x) => x.domain === domain,
        );

        if (!university) {
            throw new BadRequestException('test');
        }

        return <PartnerUniversity>university.key;
    }
}
