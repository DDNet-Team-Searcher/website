import { Module } from '@nestjs/common';
import { ServersModule } from 'src/servers/servers.module';
import { GameServersService } from './gameservers.service';

@Module({
    imports: [ServersModule],
    providers: [GameServersService],
    exports: [GameServersService],
})
export class GameServersModule { }
