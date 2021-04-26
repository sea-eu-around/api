/* eslint-disable complexity */
import { Injectable, Logger } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { In, SelectQueryBuilder } from 'typeorm';

import { DegreeType } from '../../common/constants/degree-type';
import { EducationFieldType } from '../../common/constants/education-field-type';
import { GenderType } from '../../common/constants/gender-type';
import { LanguageType } from '../../common/constants/language-type';
import { ProfileType } from '../../common/constants/profile-type';
import { PartnerUniversity } from '../../common/constants/sea';
import { StaffRoleType } from '../../common/constants/staff-role-type';
import { EducationFieldEntity } from '../../entities/educationField.entity';
import { InterestEntity } from '../../entities/interest.entity';
import { LanguageEntity } from '../../entities/language.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { ProfileOfferEntity } from '../../entities/profileOffer.entity';
import { StaffProfileEntity } from '../../entities/staffProfile.entity';
import { StaffRoleEntity } from '../../entities/staffRole.entity';
import { StudentProfileEntity } from '../../entities/studentProfile.entity';
import { UserEntity } from '../../entities/user.entity';
import { ProfileNotFoundException } from '../../exceptions/profile-not-found.exception';
import { UtilsService } from '../../providers/utils.service';
import { EducationFieldRepository } from '../../repositories/educationField.repository';
import { InterestRepository } from '../../repositories/interest.repository';
import { LanguageRepository } from '../../repositories/language.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileOfferRepository } from '../../repositories/profileOffer.repository';
import { ProfilePictureRepository } from '../../repositories/profilePicture.repository';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StaffRoleRepository } from '../../repositories/staffRole.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { UserRepository } from '../user/user.repository';
import { AddEducationFieldToProfileDto } from './dto/AddEducationFieldToProfileDto';
import { AddInterestsToProfileDto } from './dto/AddInterestsToProfileDto';
import { AddLanguageToProfileDto } from './dto/AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './dto/AddOfferToProfileDto';
import { AddStaffRolesToProfileDto } from './dto/AddStaffRolesToProfileDto';
import { ProfileCreationDto } from './dto/ProfileCreationDto';
import { UpdateAvatarDto } from './dto/UpdateAvatarDto';
import { ProfileUtils } from './profile.utils';

@Injectable()
export class ProfileService {
    private readonly _logger: Logger = new Logger(ProfileService.name);

    constructor(
        private readonly _studentProfileRepository: StudentProfileRepository,
        private readonly _staffProfileRepository: StaffProfileRepository,
        private readonly _profileRepository: ProfileRepository,
        private readonly _interestRepository: InterestRepository,
        private readonly _languageRepository: LanguageRepository,
        private readonly _profileOfferRepository: ProfileOfferRepository,
        private readonly _educationFieldRepository: EducationFieldRepository,
        private readonly _userRepository: UserRepository,
        private readonly _staffRoleRepository: StaffRoleRepository,
        private readonly _profilePictureRepository: ProfilePictureRepository,
        private readonly _profileUtils: ProfileUtils,
    ) {}

    async findOneById(id: string): Promise<ProfileEntity> {
        const profile = await this._profileRepository.findOne({ id });

        if (!profile) {
            throw new ProfileNotFoundException();
        }

        return profile;
    }

    public async sortProfiles(
        fromProfile: ProfileEntity,
        profilesQuery: SelectQueryBuilder<ProfileEntity>,
        offers: string[],
    ): Promise<ProfileEntity[]> {
        const profiles = await profilesQuery.take(80).getMany();

        profiles.map((profile) => {
            const os = this._profileUtils.offerScore(profile, offers);
            const cis = this._profileUtils.commonInterestScore(
                fromProfile,
                profile,
            );
            const chs = this._profileUtils.commonHistoryScore(
                fromProfile,
                profile,
            );
            // console.log('os : ' + os + '; chs : ' + chs + '; cis : ' + cis);
            const score = 2 * os + 5 * cis + 3 * chs;
            profile.score = score;
        });

        return profiles.sort(
            (profile1, profile2) => profile2.score - profile1.score,
        );
    }

    async getProfiles(
        profileId: string,
        universities: PartnerUniversity[],
        spokenLanguages: LanguageType[],
        degrees: DegreeType[],
        genders: GenderType[],
        types: ProfileType[],
        offers: string[],
        options: IPaginationOptions,
        staffRoles: StaffRoleType[],
        educationFields: EducationFieldType[],
    ): Promise<any> {
        const unwantedProfiles = await this._profileUtils.getUnwantedProfileIds(
            profileId,
        );
        const myProfile = await this._profileRepository.findOne(profileId);

        let profiles = this._profileRepository
            .createQueryBuilder('profile')
            .leftJoinAndSelect('profile.profileOffers', 'profileOffers')
            .leftJoinAndSelect('profile.interests', 'interests')
            .leftJoinAndSelect('profile.languages', 'languages')
            .leftJoinAndSelect('profile.avatar', 'avatar')
            .leftJoinAndSelect('profile.educationFields', 'educationFields')
            .leftJoinAndSelect('profile.staffRoles', 'staffRoles')
            .where('profile.id NOT IN (:...unwantedProfiles)', {
                unwantedProfiles,
            });

        if (genders && genders.length > 0) {
            profiles = profiles.andWhere('profile.gender IN (:...genders)', {
                genders,
            });
        }

        if (offers && offers.length > 0) {
            profiles = this._profileUtils.filterOffers(
                myProfile,
                profiles,
                offers,
            );
        }

        if (universities && universities.length > 0) {
            profiles = profiles.andWhere(
                'profile.university IN (:...universities)',
                {
                    universities,
                },
            );
        }

        if (spokenLanguages && spokenLanguages.length > 0) {
            profiles = profiles.andWhere(
                'languages.code IN (:...spokenLanguages)',
                {
                    spokenLanguages,
                },
            );
        }

        if (types && types.length > 0) {
            profiles = profiles.andWhere('profile.type IN (:...types)', {
                types,
            });

            if (staffRoles && staffRoles.length > 0) {
                const ids = (
                    await this._staffRoleRepository.find({
                        id: In(staffRoles),
                    })
                ).map((v) => v.profileId);
                profiles = profiles.andWhere('profile.id IN (:...ids)', {
                    ids,
                });
            }
        }

        if (degrees && degrees.length > 0) {
            profiles = profiles.andWhere('profile.degree IN (:...degrees)', {
                degrees,
            });
        }

        if (educationFields && educationFields.length > 0) {
            const ids = (
                await this._educationFieldRepository.find({
                    id: In(educationFields),
                })
            ).map((v) => v.profileId);
            profiles = profiles.andWhere('profile.id IN (:...ids)', {
                ids: [null, ...ids],
            });
        }

        const sortedProfiles = await this.sortProfiles(
            myProfile,
            profiles,
            offers,
        );

        const lowIndex = (options.page - 1) * options.limit;
        const highIndex = lowIndex + options.limit;
        const currentPage = sortedProfiles.slice(lowIndex, highIndex);

        return {
            items: currentPage,
            meta: {
                totalItems: sortedProfiles.length,
                itemCount: currentPage.length,
                itemsPerPage: options.limit,
                totalPages: Math.ceil(sortedProfiles.length / options.limit),
                currentPage: options.page,
            },
        };
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
            profile.university =
                UtilsService.extractUnivFromEmail({ email: user.email }) ||
                PartnerUniversity.BREST;

            Object.assign(profile, profileCreationDto);

            delete profile.avatar;
            delete profile.languages;
            delete profile.profileOffers;
            delete profile.educationFields;
            profile.user = user;

            savedProfile = await this._studentProfileRepository.save(profile);
        } else {
            profile = profile || this._staffProfileRepository.create();
            profile.university =
                UtilsService.extractUnivFromEmail({ email: user.email }) ||
                PartnerUniversity.BREST;

            Object.assign(profile, profileCreationDto);

            delete profile.avatar;
            delete profile.languages;
            delete profile.profileOffers;
            delete profile.educationFields;
            delete (<StaffProfileEntity>profile).staffRoles;
            profile.user = user;

            savedProfile = await this._staffProfileRepository.save(profile);
        }

        if (profileCreationDto.avatar) {
            savedProfile.avatar = (
                await this.updateAvatar(
                    { fileName: profileCreationDto.avatar },
                    savedProfile.id,
                )
            ).avatar;
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

        if (profileCreationDto.staffRoles) {
            (<StaffProfileEntity>(
                savedProfile
            )).staffRoles = await this.addStaffRoles(
                profileCreationDto.staffRoles,
                savedProfile.id,
            );
        }

        user.onboarded = true;

        await this._userRepository.save(user);

        return savedProfile;
    }

    async updateAvatar(
        updateAvatarDto: UpdateAvatarDto,
        profileId?: string,
        user?: UserEntity,
    ): Promise<ProfileEntity> {
        let profile = await this._profileRepository.findOne(
            { id: profileId || user.id },
            { loadEagerRelations: false },
        );

        profile.avatar = this._profilePictureRepository.create({
            creatorId: { id: profileId || user.id },
            path: updateAvatarDto.fileName,
            id: updateAvatarDto.fileName.split('.')[0],
        });

        profile = await this._profileRepository.save(profile);

        return profile;
    }

    async addInterests(
        addInterestsToProfileDto: AddInterestsToProfileDto,
        profileId?: string,
        user?: UserEntity,
    ): Promise<InterestEntity[]> {
        let profile = await this._profileRepository.findOne(
            { id: profileId || user.id },
            { loadEagerRelations: false },
        );

        const interests = await this._interestRepository.findByIds(
            addInterestsToProfileDto.interests,
        );

        profile.interests = interests;

        profile = await this._profileRepository.save(profile);

        return profile.interests;
    }

    async addLanguages(
        addLanguagesToProfileDto: AddLanguageToProfileDto[],
        profileId?: string,
        user?: UserEntity,
    ): Promise<LanguageEntity[]> {
        await this._languageRepository.delete({ profileId });

        const languages = addLanguagesToProfileDto.map((language) =>
            Object.assign(this._languageRepository.create(), {
                ...language,
                profileId: profileId || user.id,
            }),
        );

        return this._languageRepository.save(languages);
    }

    async addOffers(
        addOffersToProfileDto: AddOfferToProfileDto[],
        profileId?: string,
        user?: UserEntity,
    ): Promise<ProfileOfferEntity[]> {
        await this._profileOfferRepository.delete({ profileId });

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
        await this._educationFieldRepository.delete({ profileId });

        const educationFields = addEducationFieldsToProfileDto.map(
            (educationField) =>
                Object.assign(this._educationFieldRepository.create(), {
                    ...educationField,
                    profileId: profileId || user.id,
                }),
        );

        return this._educationFieldRepository.save(educationFields);
    }

    async addStaffRoles(
        addStaffRolesToProfileDto: AddStaffRolesToProfileDto[],
        profileId?: string,
        user?: UserEntity,
    ): Promise<StaffRoleEntity[]> {
        await this._staffRoleRepository.delete({ profileId });

        const staffRoles = addStaffRolesToProfileDto.map((staffRole) =>
            Object.assign(this._staffRoleRepository.create(), {
                ...staffRole,
                profileId: profileId || user.id,
            }),
        );

        return this._staffRoleRepository.save(staffRoles);
    }
}
