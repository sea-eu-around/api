import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchingRepository } from '../../repositories/matching.repository';
import { MessageRepository } from '../../repositories/message.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([
            UserRepository,
            ProfileRepository,
            ProfileRoomRepository,
            MessageRepository,
            MatchingRepository,
        ]),
    ],
    controllers: [UserController],
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}
