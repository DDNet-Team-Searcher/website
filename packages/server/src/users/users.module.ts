import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { HappeningsModule } from 'src/happenings/happenings.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [AuthModule, PrismaModule, HappeningsModule, NotificationsModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
