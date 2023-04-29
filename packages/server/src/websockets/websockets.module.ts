import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketsGateway } from './websockets.gateway';

@Module({
    imports: [AuthModule],
    providers: [WebsocketsGateway],
    exports: [WebsocketsGateway],
})
export class WebsocketsModule {}
