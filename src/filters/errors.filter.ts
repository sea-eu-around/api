import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    catch(error: Error, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            description: 'Internal Server Error',
            errorType: 'error.internal_server_error',
            timestamp: new Date().toISOString(),
        });
    }
}
