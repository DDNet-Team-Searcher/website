import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Run, Event } from '@app/shared/types/Happening.type';
import { UsersService } from 'src/users/users.service';
import { HappeningType } from '@prisma/client';
import { HappeningsService } from 'src/happenings/happenings.service';
import { getAvatarUrl } from 'src/utils/user.util';

const PER_PAGE = 5;

type User = {
    username: string;
    avatar: string | null;
    tier: number;
    id: number;
    verified: boolean;
    _count: {
        followers: number;
        following: number;
    };
    isFollowing: boolean;
};

type SearchResult =
    | ({ type: 'user' } & User)
    | ({ type: 'run' } & Run)
    | ({ type: 'event' } & Event);

@Injectable()
export class SearchService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly happeningsService: HappeningsService,
    ) {}

    async searchAll(
        query: string,
        page: number,
        userId: number,
    ): Promise<{ results: SearchResult[]; next: boolean }> {
        const searchResults: SearchResult[] = [];

        const user: number | undefined = (
            await this.prismaService.$queryRaw<{ id: number }[]>`
            SELECT id FROM "User"
            WHERE LOWER(username) LIKE ${query} LIMIT 1
        `
        )[0]?.id;

        if (user) {
            const profile = await this.usersService.searchUserById(
                userId,
                user,
            );

            if (profile) {
                profile.avatar = getAvatarUrl(profile.avatar);

                const isFollowing = await this.usersService.isFollowing(
                    userId,
                    profile.id,
                );

                if (page === 0) {
                    searchResults.push({
                        type: 'user',
                        ...profile,
                        isFollowing,
                    });
                }
            }
        }

        const totalCountBigInt = (
            await this.prismaService.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) FROM "Happening"
            INNER JOIN "User" ON "User".id = "Happening"."authorId"
            WHERE LOWER("User".username) LIKE ${query} OR
            LOWER("Happening".title) LIKE ${query} OR
            LOWER("Happening".description) LIKE ${query} OR
            LOWER("Happening"."mapName") LIKE ${query}
        `
        )[0].count;

        const totalCount = Number(totalCountBigInt);

        const happenings = await this.prismaService.$queryRaw<
            { id: number; type: HappeningType }[]
        >`
            SELECT "Happening".id, "Happening".type FROM "Happening"
            INNER JOIN "User" ON "User".id = "Happening"."authorId"
            WHERE LOWER("User".username) LIKE ${query} OR
            LOWER("Happening".title) LIKE ${query} OR
            LOWER("Happening".description) LIKE ${query} OR
            LOWER("Happening"."mapName") LIKE ${query}
            LIMIT ${PER_PAGE} OFFSET ${page * PER_PAGE}
        `;

        for (let i = 0; i < happenings.length; i++) {
            const happening = happenings[i];

            if (happening.type == 'Run') {
                const run = await this.happeningsService.getRunById(
                    happening.id,
                    userId,
                );

                if (run) searchResults.push({ type: 'run', ...run });
            } else if ((happening.type = 'Event')) {
                const event = await this.happeningsService.getEventById(
                    happening.id,
                    userId,
                );

                if (event) searchResults.push({ type: 'event', ...event });
            }
        }

        return {
            results: searchResults,
            next: Math.ceil(totalCount / PER_PAGE) - 1 > page,
        };
    }

    async searchRuns(
        query: string,
        page: number,
        userId: number,
    ): Promise<{ results: SearchResult[]; next: boolean }> {
        const searchResults: SearchResult[] = [];

        const totalCount = Number(
            (
                await this.prismaService.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) FROM "Happening"
            INNER JOIN "User" ON "User".id = "Happening"."authorId"
            WHERE LOWER("Happening".title) LIKE ${query} OR
            LOWER("Happening".description) LIKE ${query} OR
            LOWER("Happening"."mapName") LIKE ${query} AND
            "Happening".type = 'Run'
        `
            )[0].count,
        );

        const runIds = await this.prismaService.$queryRaw<
            { id: number; type: HappeningType }[]
        >`
            SELECT "Happening".id, "Happening".type FROM "Happening"
            INNER JOIN "User" ON "User".id = "Happening"."authorId"
            WHERE LOWER("User".username) LIKE ${query} OR
            LOWER("Happening".title) LIKE ${query} OR
            LOWER("Happening".description) LIKE ${query} OR
            LOWER("Happening"."mapName") LIKE ${query} AND
            "Happening".type = 'Run'
            LIMIT ${PER_PAGE} OFFSET ${page * PER_PAGE}
        `;

        for (const { id } of runIds) {
            const run = await this.happeningsService.getRunById(id, userId);

            if (run) searchResults.push({ type: 'run', ...run });
        }

        return {
            results: searchResults,
            next: Math.ceil(totalCount / PER_PAGE) - 1 > page,
        };
    }

    async searchEvents(
        query: string,
        page: number,
        userId: number,
    ): Promise<{ results: SearchResult[]; next: boolean }> {
        const searchResults: SearchResult[] = [];

        const totalCount = Number(
            (
                await this.prismaService.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) FROM "Happening"
            INNER JOIN "User" ON "User".id = "Happening"."authorId"
            WHERE LOWER("Happening".title) LIKE ${query} OR
            LOWER("Happening".description) LIKE ${query} OR
            LOWER("Happening"."mapName") LIKE ${query} AND
            "Happening".type = 'Event'
        `
            )[0].count,
        );

        const eventIds = await this.prismaService.$queryRaw<
            { id: number; type: HappeningType }[]
        >`
            SELECT "Happening".id, "Happening".type FROM "Happening"
            INNER JOIN "User" ON "User".id = "Happening"."authorId"
            WHERE LOWER("User".username) LIKE ${query} OR
            LOWER("Happening".title) LIKE ${query} OR
            LOWER("Happening".description) LIKE ${query} OR
            LOWER("Happening"."mapName") LIKE ${query} AND
            "Happening".type = 'Event'
            LIMIT ${PER_PAGE} OFFSET ${page * PER_PAGE}
        `;

        for (const { id } of eventIds) {
            const event = await this.happeningsService.getEventById(id, userId);

            if (event) searchResults.push({ type: 'event', ...event });
        }

        return {
            results: searchResults,
            next: Math.ceil(totalCount / PER_PAGE) - 1 > page,
        };
    }

    async searchUsers(
        query: string,
        page: number,
        userId: number,
    ): Promise<{ results: SearchResult[]; next: boolean }> {
        const searchResults: SearchResult[] = [];

        const totalCount = Number(
            (
                await this.prismaService.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) FROM "User"
            WHERE LOWER(username) LIKE ${query}
        `
            )[0].count,
        );

        const userIds = await this.prismaService.$queryRaw<
            { id: number; type: HappeningType }[]
        >`
            SELECT COUNT(*) FROM "User"
            WHERE LOWER(username) LIKE ${query}
            LIMIT ${PER_PAGE} OFFSET ${page * PER_PAGE}
        `;

        for (const { id } of userIds) {
            const profile = await this.usersService.searchUserById(id, userId);

            if (profile) {
                profile.avatar = getAvatarUrl(profile.avatar);

                const isFollowing = await this.usersService.isFollowing(
                    userId,
                    profile.id,
                );

                searchResults.push({
                    type: 'user',
                    ...profile,
                    isFollowing,
                });
            }
        }

        return {
            results: searchResults,
            next: Math.ceil(totalCount / PER_PAGE) - 1 > page,
        };
    }

    async search(
        userId: number,
        query: string,
        opts: {
            page: number;
            sort: 'all' | 'events' | 'runs' | 'users';
        },
    ): Promise<{ results: SearchResult[]; next: boolean }> {
        //NOTE: ngl, ive no fucking clue how to do it correctly :(
        const searchQuery = `%${query.toLowerCase()}%`;

        switch (opts.sort) {
            case 'runs':
                return this.searchRuns(searchQuery, opts.page, userId);
            case 'events':
                return this.searchEvents(searchQuery, opts.page, userId);
            case 'users':
                return this.searchUsers(searchQuery, opts.page, userId);
            case 'all':
            default:
                return this.searchAll(searchQuery, opts.page, userId);
        }
    }
}
