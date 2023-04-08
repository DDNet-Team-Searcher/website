import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private readonly prismaService: PrismaService) { }

    async getReviewsByHappeningId(happeningId: number) {
        return this.prismaService.review.findMany({
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
    }) {
        return await this.prismaService.review.create({
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
