import { Module } from '@nestjs/common';
import { HappeningsModule } from 'src/happenings/happenings.module';
import { CronService } from './cron.service';

@Module({
    imports: [HappeningsModule],
    providers: [CronService],
})
export class CronModule { }
