import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class DeleteGroupMemberQuerydto {
    @IsBoolean()
    @Transform((value) => value === 'true')
    readonly cascade!: boolean;
}
