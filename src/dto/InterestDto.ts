import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { InterestEntity } from '../entities/interest.entity';

export class InterestDto extends AbstractCompositeDto {
    key: string;

    constructor(interest: InterestEntity) {
        super();
        this.key = interest.key;
    }
}
