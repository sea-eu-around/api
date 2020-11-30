import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserEntity } from '../../entities/user.entity';
import { ConfigService } from '../../shared/services/config.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtWsStrategy extends PassportStrategy(Strategy, 'wsJwt') {
    constructor(
        public readonly configService: ConfigService,
        public readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('authorization'),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    async validate({ iat, exp, id: userId }): Promise<UserEntity> {
        const timeDiff = exp - iat;
        if (timeDiff <= 0) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.findOne(userId);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
