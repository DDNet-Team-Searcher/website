import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: 'my-very-secret-secret',
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [JwtModule]
})
export class UsersModule { }
