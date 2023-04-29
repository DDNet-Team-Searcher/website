import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: 'my-very-secret-secret',
        }),
    ],
    exports: [JwtModule],
})
export class AuthModule { }
