import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
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

@UseGuards(InnocentGuard)
@Controller()
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Get()
    async getReviews(@Param('happeningId') happeningId: string) {
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
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    @Innocent()
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
                data: null,
            };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}
