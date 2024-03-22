import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketsGateway } from './websockets.gateway';
import { ServersModule } from 'src/servers/servers.module';

@Module({
    imports: [AuthModule, ServersModule],
    providers: [WebsocketsGateway],
    exports: [WebsocketsGateway],
})
export class WebsocketsModule {}
