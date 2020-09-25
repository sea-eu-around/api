import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentProfileRepository } from '../../repositories/studentProfile.repository';
import { TeacherProfileRepository } from '../../repositories/teacherProfile.repository';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentProfileRepository]),
        TypeOrmModule.forFeature([TeacherProfileRepository]),
    ],
    controllers: [ProfileController],
    exports: [ProfileService],
    providers: [ProfileService],
})
export class ProfileModule {}
