import './boilerplate.polyfill';

import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { contextMiddleware } from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { GroupModule } from './modules/group/group.module';
import { InterestModule } from './modules/interest/interest.module';
import { MatchingModule } from './modules/matching/matching.module';
import { MessageModule } from './modules/message/message.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OfferModule } from './modules/offer/offer.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ReportModule } from './modules/report/report.module';
import { RoomModule } from './modules/room/room.module';
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
        RoomModule,
        MessageModule,
        CommonModule,
        MailerModule.forRootAsync({
            useFactory: (configService: ConfigService) =>
                configService.mailerConfig,
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        NotificationModule,
        ReportModule,
        GroupModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
