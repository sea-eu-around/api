import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StaffProfileRepository } from '../../repositories/staffProfile.repository';
import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentProfileRepository]),
        TypeOrmModule.forFeature([StaffProfileRepository]),
    ],
    controllers: [ProfileController],
    exports: [ProfileService],
    providers: [ProfileService],
})
export class ProfileModule {}
