/* eslint-disable complexity */
import { Injectable, Logger } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Brackets } from 'typeorm';

import { DegreeType } from '../../common/constants/degree-type';
import { GenderType } from '../../common/constants/gender-type';
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
import { StaffRoleEntity } from '../../entities/staffRole.entity';
import { StudentProfileEntity } from '../../entities/studentProfile.entity';
import { UserEntity } from '../../entities/user.entity';
import { ProfileNotFoundException } from '../../exceptions/profile-not-found.exception';
import { EducationFieldRepository } from '../../repositories/educationField.repository';
import { InterestRepository } from '../../repositories/interest.repository';
import { LanguageRepository } from '../../repositories/language.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileOfferRepository } from '../../repositories/profileOffer.repository';
import { ProfilePictureRepository } from '../../repositories/profilePicture.repository';
import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StaffRoleRepository } from '../../repositories/staffRole.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { MatchingService } from '../matching/matching.service';
import { UserRepository } from '../user/user.repository';
import { AddEducationFieldToProfileDto } from './dto/AddEducationFieldToProfileDto';
import { AddInterestsToProfileDto } from './dto/AddInterestsToProfileDto';
import { AddLanguageToProfileDto } from './dto/AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './dto/AddOfferToProfileDto';
import { AddStaffRolesToProfileDto } from './dto/AddStaffRolesToProfileDto';
import { ProfileCreationDto } from './dto/ProfileCreationDto';
import { UpdateAvatarDto } from './dto/UpdateAvatarDto';

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
        private readonly _matchingServices: MatchingService,
        private readonly _staffRoleRepository: StaffRoleRepository,
        private readonly _profilePictureRepository: ProfilePictureRepository,
    ) {}

    async findOneById(id: string): Promise<ProfileEntity> {
        const profile = await this._profileRepository.findOne({ id });

        if (!profile) {
            throw new ProfileNotFoundException();
        }

        return profile;
    }

    private async _getUnwantedProfileIds(profileId: string): Promise<string[]> {
        const matchesQuery = this._matchingServices.getMyMatches(profileId);
        const historyQuery = this._matchingServices.getHistory(profileId);
        const unwantedProfiles = [profileId];
        const [matches, history] = await Promise.all([
            matchesQuery,
            historyQuery,
        ]);

        matches.forEach((match) => {
            unwantedProfiles.push(match.id);
        });
        history.forEach((match) => {
            unwantedProfiles.push(match);
        });

        return unwantedProfiles;
    }

    /* private async _commonHistoryScore(
        fromProfile: ProfileEntity,
        withProfile: ProfileEntity,
    ): Promise<number> {
        const myHistoryQuery = this._matchingServices.getHistory(
            fromProfile.id,
        );
        const withHistoryQuery = this._matchingServices.getHistory(
            withProfile.id,
        );
        const [myHistory, withHistory] = await Promise.all([
            myHistoryQuery,
            withHistoryQuery,
        ]);

        if (fromProfile.givenLikes) {
            const test = fromProfile.givenLikes.map((like) => like.toProfileId);
            console.log(test);
        }

        let score = 0;

        const mySet = new Set(myHistory);

        console.log(myHistory);

        withHistory.forEach((action) => {
            if (mySet.has(action)) {
                score += 1;
            }
        });

        return score;
    }*/

    private _commonInterestScore(
        fromProfile: ProfileEntity,
        withProfile: ProfileEntity,
    ): number {
        const myInterestsIds = fromProfile.interests.map(
            (interest) => interest.id,
        );
        const withInterestsIds = withProfile.interests.map(
            (interest) => interest.id,
        );

        let score = 0;

        const mySet = new Set(myInterestsIds);
        // console.log(mySet);
        // console.log(withInterestsIds);

        withInterestsIds.forEach((interest) => {
            if (mySet.has(interest)) {
                score += 1;
            }
        });

        return score;
    }

    private _offerScore(withProfile: ProfileEntity, offers: string[]): number {
        let score = 0;

        if (!offers || offers.length === 0) {
            return 0;
        }
        const offerSet = new Set(offers);
        const withOfferIds = withProfile.profileOffers.map(
            (offer) => offer.offerId,
        );

        withOfferIds.forEach((offer) => {
            if (offerSet.has(offer)) {
                score += 1;
            }
        });

        return score;
    }

    public sortProfiles(
        fromProfile: ProfileEntity,
        profiles: ProfileEntity[],
        offers: string[],
    ): ProfileEntity[] {
        profiles.map((profile) => {
            const os = this._offerScore(profile, offers);
            // const chs = await this._commonHistoryScore(fromProfile, profile);
            const cis = this._commonInterestScore(fromProfile, profile);
            const score = /*3 * chs +*/ 7 * cis + 2 * os;
            profile.score = score;
        });

        return profiles;
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
    ): Promise<Pagination<ProfileEntity>> {
        const unwantedProfiles = await this._getUnwantedProfileIds(profileId);
        const myProfile = await this._profileRepository.findOne(profileId);

        let profiles = this._profileRepository
            .createQueryBuilder('profile')
            .leftJoinAndSelect('profile.profileOffers', 'profileOffers')
            .leftJoinAndSelect('profile.interests', 'interests')
            .leftJoinAndSelect('profile.languages', 'languages')
            .leftJoinAndSelect('profile.givenLikes', 'givenLikes')
            .leftJoinAndSelect('profile.receivedLikes', 'revceivedLikes')
            .leftJoinAndSelect('profile.avatar', 'avatar')
            .where('profile.id NOT IN (:...unwantedProfiles)', {
                unwantedProfiles,
            });

        if (genders && genders.length > 0) {
            profiles = profiles.andWhere('profile.gender IN (:...genders)', {
                genders,
            });
        }

        if (offers && offers.length > 0) {
            profiles = profiles.andWhere(
                new Brackets((qb) => {
                    if (myProfile.gender === GenderType.MALE) {
                        qb.andWhere('profileOffers.allowMale = :bool', {
                            bool: true,
                        });
                    }
                    if (myProfile.gender === GenderType.FEMALE) {
                        qb.andWhere('profileOffers.allowFemale = :bool', {
                            bool: true,
                        });
                    }
                    if (myProfile.gender === GenderType.OTHER) {
                        qb.andWhere('profileOffers.allowOther = :bool', {
                            bool: true,
                        });
                    }
                    if (myProfile.type === ProfileType.STUDENT) {
                        qb.andWhere('profileOffers.allowStudent = :bool', {
                            bool: true,
                        });
                    }
                    if (myProfile.type === ProfileType.STAFF) {
                        qb.andWhere('profileOffers.allowStaff = :bool', {
                            bool: true,
                        });
                    }

                    qb.andWhere(
                        new Brackets((subQb) => {
                            for (const offer of offers) {
                                subQb.orWhere(
                                    `profileOffers.offerId = '${offer}'`,
                                );
                            }
                        }),
                    );
                }),
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
        }

        if (degrees && degrees.length > 0) {
            profiles = profiles.andWhere('profile.degree IN (:...degrees)', {
                degrees,
            });
        }
        // const rProfiles = await profiles.take(10).getMany();

        // const scoredProfiles = this.sortProfiles(myProfile, rProfiles, offers);
        // const sortedProfiles = scoredProfiles.sort(
        //    (profile1, profile2) => profile2.score - profile1.score,
        // );
        // console.log(await profiles.getMany());
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

            delete profile.avatar;
            delete profile.languages;
            delete profile.profileOffers;
            delete profile.educationFields;
            profile.user = user;

            savedProfile = await this._studentProfileRepository.save(profile);
        } else {
            profile = profile || this._staffProfileRepository.create();
            profile.university = ProfileService._findUnivFromEmail(user.email);

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

    private static _findUnivFromEmail(email: string) {
        const domain = email.split('@')[1];

        const university = PARTNER_UNIVERSITIES.find(
            (x) => x.domain === domain,
        );

        if (!university) {
            return PartnerUniversity.BREST;
        }

        return <PartnerUniversity>university.key;
    }
}
