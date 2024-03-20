import {
    Body,
    Controller,
    Get,
    HttpException,
    InternalServerErrorException,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UnprocessableEntityException,
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
import { HappeningsService } from 'src/happenings/happenings.service';
import { Status } from '@prisma/client';

@UseGuards(InnocentGuard)
@Controller()
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly happeningsService: HappeningsService,
        private readonly logger: Logger,
    ) {}

    @Protected()
    @Innocent()
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
                data: reviews,
            };
        } catch (e) {
            this.logger.error(new Error("failed to load happening's reviews"));
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Innocent()
    @Post('/:userId')
    @log('create a new review')
    async createReview(
        @Req() req: AuthedRequest,
        @Param('happeningId', ParseIntPipe) happeningId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() body: CreateReviewDTO,
    ): Promise<CreateReviewResponse> {
        try {
            const happeningExists = await this.happeningsService.exists(
                happeningId,
            );

            if (!happeningExists) {
                throw new UnprocessableEntityException({
                    status: 'fail',
                    data: null,
                    message: "Happening doesn't exist",
                });
            }

            const happeningStatus =
                await this.happeningsService.happeningStatus(happeningId);

            if (happeningStatus !== Status.Finished) {
                throw new UnprocessableEntityException({
                    status: 'fail',
                    data: null,
                    message:
                        "Cant't leave review on a happening which is not finished",
                });
            }

            if (req.user.id === userId) {
                throw new UnprocessableEntityException({
                    status: 'fail',
                    data: null,
                    message: 'Cant review yourself',
                });
            }

            const exists = await this.reviewsService.exists(
                req.user.id,
                userId,
                happeningId,
            );

            if (exists) {
                throw new UnprocessableEntityException({
                    status: 'fail',
                    data: null,
                    message: 'You already left a review about this user',
                });
            }

            await this.reviewsService.createReview({
                happeningId: happeningId,
                authorId: req.user.id,
                reviewedUserId: userId,
                text: body.text,
                rate: body.rate,
            });

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            this.logger.error(new Error('failed to create a new review'));
            if (e instanceof HttpException) {
                throw e;
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}
