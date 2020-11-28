import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { UserRoomEntity } from '../entities/userRoom.entity';

export class UserRoomDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    userId: string;

    @ApiPropertyOptional()
    roomId: string;

    @ApiPropertyOptional()
    lastMessagesSeenId?: string;

    constructor(userRoom: UserRoomEntity) {
        super();
        Object.assign(this, userRoom);
    }
}
