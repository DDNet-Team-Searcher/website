import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAvatarUrl } from 'src/utils/user.util';
import { ProfileReview, Review } from '@app/shared/types/Review.type';

@Injectable()
export class ReviewsService {
    constructor(private readonly prismaService: PrismaService) {}

    async exists(
        authedUserId: number,
        userId: number,
        happeningId: number,
    ): Promise<boolean> {
        return this.prismaService.exists(this.prismaService.review, {
            where: {
                happeningId,
                authorId: authedUserId,
                reviewedUserId: userId,
            },
        });
    }

    async getReviewsByHappeningId(happeningId: number): Promise<Review[]> {
        const reviews = await this.prismaService.review.findMany({
            where: {
                happeningId,
            },
            select: {
                id: true,
                rate: true,
                review: true,
                createdAt: true,
                reviewedUser: {
                    select: {
                        id: true,
                        avatar: true,
                        username: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        avatar: true,
                        username: true,
                    },
                },
            },
        });

        return reviews.map((review) => ({
            ...review,
            createdAt: review.createdAt.toJSON(),
            reviewedUser: {
                ...review.reviewedUser,
                avatar: getAvatarUrl(review.reviewedUser.avatar),
            },
            author: {
                ...review.author,
                avatar: getAvatarUrl(review.author.avatar),
            },
        }));
    }

    async createReview({
        happeningId,
        reviewedUserId,
        authorId,
        rate,
        text,
    }: {
        happeningId: number;
        reviewedUserId: number;
        authorId: number;
        rate: number;
        text: string | null;
    }): Promise<void> {
        await this.prismaService.review.create({
            data: {
                happeningId,
                authorId,
                reviewedUserId,
                rate,
                review: text,
            },
        });
    }

    async reviewsAboutUser(userId: number): Promise<ProfileReview[]> {
        const reviews = await this.prismaService.review.findMany({
            select: {
                id: true,
                review: true,
                createdAt: true,
                rate: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
            where: {
                reviewedUserId: userId,
            },
        });

        return reviews.map((review) => ({
            ...review,
            createdAt: review.createdAt.toString(),
            author: {
                ...review.author,
                avatar: getAvatarUrl(review.author.avatar),
            },
        }));
    }
}
