import { Module } from '@nestjs/common';

import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
    providers: [CommonService],
    controllers: [CommonController],
    exports: [CommonService],
})
export class CommonModule {}
