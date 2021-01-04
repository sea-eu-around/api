import { ChildEntity } from 'typeorm';

import { GroupType } from '../common/constants/group-type';
import { PublicGroupDto } from '../dto/PublicGroupDto';
import { GroupEntity } from './group.entity';

@ChildEntity(GroupType.PUBLIC)
export class PublicGroupEntity extends GroupEntity {
    dtoClass = PublicGroupDto;
}
