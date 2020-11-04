import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { InterestEntity } from '../entities/interest.entity';

export class InterestDto extends AbstractCompositeDto {
    id: string;

    constructor(interest: InterestEntity) {
        super();
        this.id = interest.id;
    }
}
