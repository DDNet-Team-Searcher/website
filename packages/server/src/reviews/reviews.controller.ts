import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Protected } from 'src/decorators/protected.decorator';
import { CreateReviewDTO } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller()
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Get()
    async getReviews(@Param('happeningId') happeningId: string) {
        try {
            const reviews = await this.reviewsService.getReviewsByHappeningId(parseInt(happeningId));

            return {
                status: 'success',
                data: {
                    reviews: reviews
                }
            };
        } catch (e) {
            console.log(e);
        }
    }

    @Protected()
    @Post('/:userId')
    async createReview(
        @Req() req,
        @Param('happeningId') happeningId: string,
        @Param('userId') userId: string,
        @Body() body: CreateReviewDTO,
    ) {
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
                data: {
                    message: 'ALL GUUUUT',
                },
            };
        } catch (e) {
            console.log("We're fucked");
            console.log(e);
        }
    }
}
