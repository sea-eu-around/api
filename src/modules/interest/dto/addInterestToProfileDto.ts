import { ApiProperty } from '@nestjs/swagger';

export class AddInterestToProfileDto {
    @ApiProperty()
    readonly interestIds: string[];

    @ApiProperty()
    readonly profileId: string;

    constructor(interestIds: string[], profileId: string) {
        this.interestIds = interestIds;
        this.profileId = profileId;
    }
}
