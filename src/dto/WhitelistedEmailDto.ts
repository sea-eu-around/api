import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { WhitelistedEmailEntity } from '../entities/whitelistedEmail.entity';

export class WhitelistedEmailDto extends AbstractCompositeDto {
    email: string;

    constructor(whitelistedEmail: WhitelistedEmailEntity) {
        super();
        Object.assign(this, whitelistedEmail);
    }
}
