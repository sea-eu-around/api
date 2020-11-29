import { EntityRepository, Repository } from 'typeorm';

import { MessageEntity } from '../entities/message.entity';

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {}
