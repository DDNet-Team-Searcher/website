import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    process.env.BASE_URL =
        'http://' +
        process.env.HOST +
        (parseInt(process.env.PORT || '') === 80 ? '' : `:${process.env.PORT}`);
    process.env.AVATAR_URL = process.env.BASE_URL! + "/" + process.env.AVATAR_PATH!;

    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: `http://${process.env.HOST}:3000`,
            credentials: true,
        },
    });
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            exceptionFactory: (error) => {
                const res = {};

                error.map((err) => {
                    res[err.property] = Object.values(err.constraints!)[0];
                });

                throw new BadRequestException({
                    status: 'fail',
                    data: res,
                });
            },
        }),
    );

    app.setGlobalPrefix('/api');
    await app.listen(process.env.PORT || 8080);
}
bootstrap();
