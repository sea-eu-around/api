import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from 'typeorm';

import { ProfileEntity } from '../../entities/profile.entity';

@EventSubscriber()
export class ProfileSubscriber
    implements EntitySubscriberInterface<ProfileEntity> {
    listenTo() {
        return ProfileEntity;
    }

    afterLoad(entity: ProfileEntity, event: LoadEvent<ProfileEntity>): void {
        entity.avatar =
            'https://aas-bucket.s3.eu-west-3.amazonaws.com/' + entity.avatar;
    }
}
