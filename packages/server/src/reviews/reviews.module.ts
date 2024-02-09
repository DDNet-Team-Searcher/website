import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
    imports: [PrismaModule],
    controllers: [ReviewsController],
    providers: [Logger, ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule {}
