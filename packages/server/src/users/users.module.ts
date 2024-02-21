import { Logger, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { HappeningsModule } from 'src/happenings/happenings.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        HappeningsModule,
        ReviewsModule,
        NotificationsModule,
        ReportsModule,
    ],
    controllers: [UsersController],
    providers: [Logger, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
