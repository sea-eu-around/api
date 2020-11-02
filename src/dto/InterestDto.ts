import { AbstractDto } from '../common/dto/AbstractDto';
import { InterestEntity } from '../entities/interest.entity';

export class InterestDto extends AbstractDto {
    key: string;

    constructor(interest: InterestEntity) {
        super(interest);
        this.key = interest.key;
    }
}
