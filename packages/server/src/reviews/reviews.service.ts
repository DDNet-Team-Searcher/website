import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAvatarUrl } from 'src/utils/user.util';

@Injectable()
export class ReviewsService {
    constructor(private readonly prismaService: PrismaService) { }

    async getReviewsByHappeningId(happeningId: number) {
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
            review.reviewedUser.avatar = getAvatarUrl(review.reviewedUser.avatar);
            review.author.avatar = getAvatarUrl(review.author.avatar);
        }

        return reviews;
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
}
