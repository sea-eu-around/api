import { ChildEntity } from 'typeorm';

import { GroupType } from '../common/constants/group-type';
import { PrivateGroupDto } from '../dto/PrivateGroupDto';
import { GroupEntity } from './group.entity';

@ChildEntity(GroupType.PRIVATE)
export class PrivateGroupEntity extends GroupEntity {
    dtoClass = PrivateGroupDto;
}
