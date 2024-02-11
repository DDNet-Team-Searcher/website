import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAvatarUrl } from 'src/utils/user.util';
import { ProfileReview, Review } from '@app/shared/types/Review.type';

@Injectable()
export class ReviewsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getReviewsByHappeningId(happeningId: number): Promise<Review[]> {
        const res: Review[] = [];

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

        for (const review of reviews) {
            //TODO: refactor this bs, coz all these clones just to satisty ts
            //to have createdAt as `string` instead of `Date`
            res.push({
                ...review,
                createdAt: review.createdAt.toString(),
                reviewedUser: {
                    ...review.reviewedUser,
                    avatar: getAvatarUrl(review.reviewedUser.avatar),
                },
                author: {
                    ...review.reviewedUser,
                    avatar: getAvatarUrl(review.author.avatar),
                },
            });
        }

        return res;
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
        const res: ProfileReview[] = [];

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

        //TODO: lotta unnecessary copying
        for (const review of reviews) {
            res.push({
                ...review,
                createdAt: review.createdAt.toString(),
                author: {
                    ...review.author,
                    avatar: getAvatarUrl(review.author.avatar),
                },
            });
        }

        return res;
    }
}
