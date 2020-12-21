import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';

import { UserEntity } from '../../entities/user.entity';
import { UtilsService } from '../../providers/utils.service';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    listenTo(): typeof UserEntity {
        return UserEntity;
    }
    beforeInsert(event: InsertEvent<UserEntity>): void {
        if (event.entity.password) {
            event.entity.password = UtilsService.generateHash(
                event.entity.password,
            );
        }

        if (event.entity.email) {
            event.entity.email = event.entity.email.toLowerCase();
        }
    }
    beforeUpdate(event: UpdateEvent<UserEntity>): void {
        if (
            event.entity.password &&
            event.entity.password !== event.databaseEntity.password
        ) {
            event.entity.password = UtilsService.generateHash(
                event.entity.password,
            );
        }

        if (event.entity.email) {
            event.entity.email = event.entity.email.toLowerCase();
        }
    }
}
