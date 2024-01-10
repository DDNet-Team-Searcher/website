import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServersService } from './servers.service';

@Module({
    imports: [PrismaModule],
    providers: [Logger, ServersService],
    exports: [ServersService],
})
export class ServersModule {}
