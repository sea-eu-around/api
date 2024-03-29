import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class NotificationService {
    constructor(private readonly _userRepository: UserRepository) {}

    async addToken(token: string, user: UserEntity): Promise<UserEntity> {
        user.expoPushToken = token;

        return this._userRepository.save(user);
    }

    async removeToken(user: UserEntity): Promise<UserEntity> {
        user.expoPushToken = null;

        return this._userRepository.save(user);
    }
}
