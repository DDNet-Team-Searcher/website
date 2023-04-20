import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HappeningsModule } from 'src/happenings/happenings.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: 'my-very-secret-secret',
        }),
        HappeningsModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [JwtModule]
})
export class UsersModule { }
