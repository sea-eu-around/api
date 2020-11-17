import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    LoadEvent,
    UpdateEvent,
} from 'typeorm';

import { ProfileEntity } from '../../entities/profile.entity';
import { UtilsService } from '../../providers/utils.service';

@EventSubscriber()
export class ProfileSubscriber
    implements EntitySubscriberInterface<ProfileEntity> {
    listenTo() {
        return ProfileEntity;
    }

    afterLoad(entity: ProfileEntity, event: LoadEvent<ProfileEntity>): void {
        if (UtilsService.isImageFilename(entity.avatar)) {
            entity.avatar =
                'https://aas-bucket.s3.eu-west-3.amazonaws.com/' +
                entity.avatar;
        }
    }

    afterInsert(event: InsertEvent<ProfileEntity>): void {
        if (UtilsService.isImageFilename(event.entity.avatar)) {
            event.entity.avatar =
                'https://aas-bucket.s3.eu-west-3.amazonaws.com/' +
                event.entity.avatar;
        }
    }

    afterUpdate(event: UpdateEvent<ProfileEntity>): void {
        if (UtilsService.isImageFilename(event.entity.avatar)) {
            event.entity.avatar =
                'https://aas-bucket.s3.eu-west-3.amazonaws.com/' +
                event.entity.avatar;
        }
    }
}
