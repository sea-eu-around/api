import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    LoadEvent,
    UpdateEvent,
} from 'typeorm';

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

    afterInsert(event: InsertEvent<ProfileEntity>): void {
        event.entity.avatar =
            'https://aas-bucket.s3.eu-west-3.amazonaws.com/' +
            event.entity.avatar;
    }

    afterUpdate(event: UpdateEvent<ProfileEntity>): void {
        event.entity.avatar =
            'https://aas-bucket.s3.eu-west-3.amazonaws.com/' +
            event.entity.avatar;
    }
}
