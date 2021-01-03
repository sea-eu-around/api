import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LanguageRepository } from '../../repositories/language.repository';
import { MediaRepository } from '../../repositories/media.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserRepository,
            ProfileRepository,
            LanguageRepository,
            MediaRepository,
        ]),
    ],
    controllers: [UserController],
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}
