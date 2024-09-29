import { Logger, Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [PrismaModule, forwardRef(() => UsersModule)],
    controllers: [ServersController],
    providers: [Logger, ServersService],
    exports: [ServersService],
})
export class ServersModule {}
