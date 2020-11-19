import './boilerplate.polyfill';

import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { contextMiddleware } from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { InterestModule } from './modules/interest/interest.module';
import { MatchingModule } from './modules/matching/matching.module';
import { OfferModule } from './modules/offer/offer.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ProfileModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        InterestModule,
        OfferModule,
        MatchingModule,
        CommonModule,
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport:
                    'smtps://around:Cf@c!1E1mo2pA@mailhost.univ-brest.fr',
                defaults: {
                    from: '"SEA-EU Around" <sea-eu.around@univ-brest.fr>',
                },
            }),
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
