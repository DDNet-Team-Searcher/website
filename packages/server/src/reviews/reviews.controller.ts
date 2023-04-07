import { Controller, Patch, Post, Put } from "@nestjs/common";

// @Controller('reviews')
@Controller()
export class ReviewsController {
    @Patch()
    // @Post()

    async createReview() {
        return {
            status: 'success',
            data: {
                message: "ALL GUUUUT"
            }
        };
    }
}
