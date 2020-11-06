import { Injectable } from '@nestjs/common';
import { date, internet, name, random } from 'faker';
import { float } from 'random';

import { DegreeType } from '../../common/constants/degree-type';
import { EducationFieldType } from '../../common/constants/education-field-type';
import { GenderType } from '../../common/constants/gender-type';
import { LanguageLevelType } from '../../common/constants/language-level-type';
import { LanguageType } from '../../common/constants/language-type';
import { NationalityType } from '../../common/constants/nationality-type';
import { ProfileType } from '../../common/constants/profile-type';
import { RoleType } from '../../common/constants/role-type';
import {
    CountryCode,
    PartnerUniversityDomain,
} from '../../common/constants/sea';
import { StaffRoleType } from '../../common/constants/staff-role-type';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../entities/user.entity';
import { InterestRepository } from '../../repositories/interest.repository';
import { OfferRepository } from '../../repositories/offer.repository';
import { ProfileCreationDto } from '../profile/dto/ProfileCreationDto';
import { ProfileService } from '../profile/profile.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class SeedService {
    constructor(
        private _userRepository: UserRepository,
        private _interestRepository: InterestRepository,
        private _offerRepository: OfferRepository,
        public profileService: ProfileService,
    ) {}

    async generateUsers(n: number): Promise<UserEntity[]> {
        const users = Array.from({ length: n }).map<Partial<UserEntity>>(() => {
            const user = this._userRepository.create();
            user.email =
                internet.email().split('@')[0] +
                '@' +
                random.arrayElement(Object.values(PartnerUniversityDomain));
            user.password = internet.password();
            user.role = float() < 0.9 ? RoleType.USER : RoleType.ADMIN;
            user.active = float() < 0.8 ? true : false;
            user.onboarded = false;
            user.verificationToken = random.uuid();
            return user;
        });

        return this._userRepository.save(users);
    }

    async generateProfiles(
        n: number,
        alreadyGeneratedUsers?: UserEntity[],
    ): Promise<ProfileEntity[]> {
        const users =
            alreadyGeneratedUsers && alreadyGeneratedUsers.length === n
                ? alreadyGeneratedUsers
                : alreadyGeneratedUsers
                ? [
                      ...alreadyGeneratedUsers,
                      ...(await this.generateUsers(
                          n - alreadyGeneratedUsers.length,
                      )),
                  ]
                : await this.generateUsers(n);

        const interests = await this._interestRepository.find();

        const offers = await this._offerRepository.find();

        const profiles = Array.from({ length: n }).map<ProfileCreationDto>(
            () => {
                if (float() < 0.7) {
                    const profile = new ProfileCreationDto();
                    profile.type = ProfileType.STUDENT;
                    profile.firstName = name.firstName();
                    profile.lastName = name.lastName();
                    profile.gender = random.arrayElement(
                        Object.values(GenderType),
                    );
                    profile.birthdate = date.between(
                        new Date(1993, 1, 1),
                        new Date(2000, 1, 1),
                    );
                    profile.educationField = random.arrayElement(
                        Object.values(EducationFieldType),
                    );
                    profile.nationality = <NationalityType>(
                        (<unknown>(
                            random.arrayElement(Object.values(CountryCode))
                        ))
                    );
                    profile.languages = random
                        .arrayElements(
                            Object.values(LanguageType),
                            1 + random.number(4),
                        )
                        .map((x) => ({
                            code: x,
                            level: random.arrayElement(
                                Object.values(LanguageLevelType),
                            ),
                        }));
                    profile.interests = random.arrayElements(
                        interests.map((x) => x.id),
                        1 + random.number(9),
                    );
                    profile.degree = random.arrayElement(
                        Object.values(DegreeType),
                    );
                    profile.profileOffers = random.arrayElements(
                        offers.map(
                            (offer) => ({
                                offerId: offer.id,
                                allowStaff: offer.allowChooseProfileType
                                    ? random.boolean()
                                    : null,
                                allowStudent: offer.allowChooseProfileType
                                    ? random.boolean()
                                    : null,
                                allowMale: offer.allowChooseGender
                                    ? random.boolean()
                                    : null,
                                allowFemale: offer.allowChooseGender
                                    ? random.boolean()
                                    : null,
                                allowOther: offer.allowChooseGender
                                    ? random.boolean()
                                    : null,
                            }),
                            random.number(9),
                        ),
                    );
                    return profile;
                }
                {
                    const profile = new ProfileCreationDto();
                    profile.firstName = name.firstName();
                    profile.lastName = name.lastName();
                    profile.gender = random.arrayElement(
                        Object.values(GenderType),
                    );
                    profile.birthdate = date.between(
                        new Date(1960, 1, 1),
                        new Date(1995, 1, 1),
                    );
                    profile.educationField = random.arrayElement(
                        Object.values(EducationFieldType),
                    );
                    profile.nationality = <NationalityType>(
                        (<unknown>(
                            random.arrayElement(Object.values(CountryCode))
                        ))
                    );
                    profile.languages = random
                        .arrayElements(
                            Object.values(LanguageType),
                            1 + random.number(4),
                        )
                        .map((x) => ({
                            code: x,
                            level: random.arrayElement(
                                Object.values(LanguageLevelType),
                            ),
                        }));
                    profile.interests = random.arrayElements(
                        interests.map((x) => x.id),
                        1 + random.number(9),
                    );
                    profile.staffRole = random.arrayElement(
                        Object.values(StaffRoleType),
                    );
                    profile.profileOffers = random.arrayElements(
                        offers.map(
                            (offer) => ({
                                offerId: offer.id,
                                allowStaff: offer.allowChooseProfileType
                                    ? random.boolean()
                                    : null,
                                allowStudent: offer.allowChooseProfileType
                                    ? random.boolean()
                                    : null,
                                allowMale: offer.allowChooseGender
                                    ? random.boolean()
                                    : null,
                                allowFemale: offer.allowChooseGender
                                    ? random.boolean()
                                    : null,
                                allowOther: offer.allowChooseGender
                                    ? random.boolean()
                                    : null,
                            }),
                            random.number(9),
                        ),
                    );
                    return profile;
                }
            },
        );

        return Promise.all(
            profiles.map((profile, index) =>
                this.profileService.createOrUpdate(profile, users[index]),
            ),
        );
    }
}
