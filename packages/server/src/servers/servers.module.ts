import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';

@Module({
    imports: [PrismaModule],
    controllers: [ServersController],
    providers: [Logger, ServersService],
    exports: [ServersService],
})
export class ServersModule {}
