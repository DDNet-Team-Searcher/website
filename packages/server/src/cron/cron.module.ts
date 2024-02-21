import { Logger, Module } from '@nestjs/common';
import { HappeningsModule } from 'src/happenings/happenings.module';
import { CronService } from './cron.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
    imports: [HappeningsModule, NotificationsModule],
    providers: [CronService, Logger],
})
export class CronModule {}
