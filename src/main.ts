import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
    ExpressAdapter,
    NestExpressApplication,
} from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import * as RateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { ResponseTransformInterceptor } from './interceptors/response-transform-interceptor.service';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { setupSwagger } from './viveo-swagger';

async function bootstrap() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        { cors: true },
    );
    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(helmet());
    app.use(
        RateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use(compression());
    app.use(morgan('combined'));

    const reflector = app.get(Reflector);

    app.useGlobalFilters(
        new BadRequestExceptionFilter(reflector),
        new QueryFailedFilter(reflector),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(reflector),
        new ResponseTransformInterceptor(),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            dismissDefaultMessages: false,
            validationError: {
                target: false,
            },
        }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const configService = app.select(SharedModule).get(ConfigService);

    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            port: configService.getNumber('TRANSPORT_PORT'),
            retryAttempts: 5,
            retryDelay: 3000,
        },
    });

    await app.startAllMicroservicesAsync();

    if (['development', 'staging'].includes(configService.nodeEnv)) {
        setupSwagger(app);
    }

    const port = configService.getNumber('PORT');
    await app.listen(port);

    console.info(`server running on port ${port}`);
}

void bootstrap();
