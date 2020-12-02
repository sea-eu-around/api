import {
    ClassSerializerInterceptor,
    UnprocessableEntityException,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
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

import { PostgresIoAdapter } from './adapters/postgres.adapter';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { UnprocessableEntityFilter } from './filters/unprocessable-entity.filter';
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
        new HttpExceptionFilter(reflector),
        new UnprocessableEntityFilter(reflector),
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
            errorHttpStatusCode: 422,
            exceptionFactory: (errors) => {
                throw new UnprocessableEntityException(errors);
            },
            validationError: {
                target: false,
                value: false,
            },
        }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const configService = app.select(SharedModule).get(ConfigService);

    app.useWebSocketAdapter(new PostgresIoAdapter(app));

    if (['development', 'staging'].includes(configService.nodeEnv)) {
        setupSwagger(app);
    }

    const port = configService.getNumber('PORT');
    await app.listen(port);

    console.info(`server running on port ${port}`);
}

void bootstrap();
