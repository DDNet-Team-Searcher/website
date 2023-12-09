import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { HappeningsModule } from './happenings/happenings.module';
import { ReviewsModule } from './reviews/reviews.module';
import * as path from 'path';
import { WebsocketsModule } from './websockets/websockets.module';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './cron/cron.module';
import { SearchModule } from './search/search.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

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
        SearchModule,
        WebsocketsModule,
        CronModule,
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: 'i18n/',
                watch: true,
            },
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
                new HeaderResolver(['x-lang']),
            ]
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule { }
