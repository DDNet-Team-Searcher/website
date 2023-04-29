import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { HappeningsModule } from './happenings/happenings.module';
import { ReviewsModule } from './reviews/reviews.module';
import * as path from 'path';
import { WebsocketsModule } from './websockets/websockets.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '../public'),
            serveRoot: '/public',
        }),
        AuthModule,
        UsersModule,
        HappeningsModule,
        ReviewsModule,
        RouterModule.register([
            {
                path: '/happenings',
                module: HappeningsModule,
                children: [
                    {
                        path: '/:happeningId/reviews',
                        module: ReviewsModule,
                    },
                ],
            },
        ]),
        WebsocketsModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule { }
