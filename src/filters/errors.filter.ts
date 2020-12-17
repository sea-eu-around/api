import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    private readonly _logger: Logger = new Logger(ErrorFilter.name);

    catch(error: Error, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse();

        this._logger.error(error.message, error.stack);

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            description: 'Internal Server Error',
            errorType: 'error.internal_server_error',
            timestamp: new Date().toISOString(),
        });
    }
}
