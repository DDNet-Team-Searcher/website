import { Module } from '@nestjs/common';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HappeningsController } from './happenings.controller';
import { HappeningsService } from './happenings.service';

@Module({
    imports: [
        PrismaModule,
        NotificationsModule
    ],
    controllers: [HappeningsController],
    providers: [HappeningsService],
    exports: [HappeningsService]
})
export class HappeningsModule {}
