import { IoAdapter } from '@nestjs/platform-socket.io';
import * as postgresIoAdapter from 'socket.io-adapter-postgres';

import { ConfigService } from '../shared/services/config.service';

export class PostgresIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        const posgresAdapter = postgresIoAdapter(
            new ConfigService().postgresIoAdapterConfig,
        );

        server.adapter(posgresAdapter);
        return server;
    }
}
