import { Column, Entity, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { WhitelistedEmailDto } from '../dto/WhitelistedEmailDto';

@Entity('whitelisted_email')
export class WhitelistedEmailEntity extends AbstractCompositeEntity<WhitelistedEmailDto> {
    @Column()
    @PrimaryColumn()
    email: string;

    dtoClass = WhitelistedEmailDto;
}
