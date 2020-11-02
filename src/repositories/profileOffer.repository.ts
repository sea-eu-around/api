import { EntityRepository, Repository } from 'typeorm';

import { ProfileOfferEntity } from '../entities/profileOffer.entity';

@EntityRepository(ProfileOfferEntity)
export class ProfileOfferRepository extends Repository<ProfileOfferEntity> {}
