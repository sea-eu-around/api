import { AbstractDto } from '../common/dto/AbstractDto';
import { InterestEntity } from '../entities/interest.entity';

export class InterestDto extends AbstractDto {
    name: string;

    constructor(interest: InterestEntity) {
        super(interest);
        this.name = interest.name;
    }
}
