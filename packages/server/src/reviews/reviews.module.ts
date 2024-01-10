import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
    imports: [PrismaModule],
    controllers: [Logger, ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}
