import { IsBoolean } from 'class-validator';

export class DeleteGroupMemberQuerydto {
    @IsBoolean()
    readonly cascade!: boolean;
}
