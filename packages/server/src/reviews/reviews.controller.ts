import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Protected } from 'src/decorators/protected.decorator';
import { CreateReviewDTO } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
import { Innocent } from 'src/decorators/innocent.decorator';
import { InnocentGuard } from 'src/guards/innocent.guard';
import { AuthedRequest } from 'src/types/AuthedRequest.type';
import {
    CreateReviewResponse,
    GetReviewsResponse,
} from '@app/shared/types/api.type';
import { log } from 'src/decorators/log.decorator';

@UseGuards(InnocentGuard)
@Controller()
export class ReviewsController {
    constructor(
        private reviewsService: ReviewsService,
        private readonly logger: Logger,
    ) {}

    @Get()
    @log("get happening's reviews")
    async getReviews(
        @Param('happeningId') happeningId: string,
    ): Promise<GetReviewsResponse> {
        try {
            const reviews = await this.reviewsService.getReviewsByHappeningId(
                parseInt(happeningId),
            );

            return {
                status: 'success',
                data: {
                    reviews: reviews,
                },
            };
        } catch (e) {
            this.logger.error(new Error("failed to load happening's reviews"));
            throw new InternalServerErrorException();
        }
    }

    @Innocent()
    @Protected()
    @Post('/:userId')
    @log('create a new review')
    async createReview(
        @Req() req: AuthedRequest,
        @Param('happeningId') happeningId: string,
        @Param('userId') userId: string,
        @Body() body: CreateReviewDTO,
    ): Promise<CreateReviewResponse> {
        try {
            await this.reviewsService.createReview({
                happeningId: parseInt(happeningId),
                authorId: req.user.id,
                reviewedUserId: parseInt(userId),
                text: body.text,
                rate: body.rate,
            });

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            this.logger.error(new Error('failed to create a new review'));
            throw new InternalServerErrorException();
        }
    }
}
