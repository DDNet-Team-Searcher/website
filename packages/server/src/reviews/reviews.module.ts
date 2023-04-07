import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService]
})
export class ReviewsModule {}
