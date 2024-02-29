import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchResult } from '@app/shared/types/SearchResult.type';
import { UsersService } from 'src/users/users.service';
import { HappeningType } from '@prisma/client';
import { HappeningsService } from 'src/happenings/happenings.service';
import { getAvatarUrl } from 'src/utils/user.util';

const PER_PAGE = 5;

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
        const totalCount = await this.prismaService.happening.count({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        mapName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        author: {
                            username: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
            },
        });

        const happenings = await this.prismaService.happening.findMany({
            select: {
                id: true,
                type: true,
            },
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        mapName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        author: {
                            username: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
            },
            take: PER_PAGE,
            skip: page * PER_PAGE,
        });

        for (let i = 0; i < happenings.length; i++) {
            const happening = happenings[i];

            if (happening.type == 'Run') {
                const run = await this.happeningsService.getRunById(
                    happening.id,
                    userId,
                );
                searchResults.push(run);
            } else if ((happening.type = 'Event')) {
                const event = await this.happeningsService.getEventById(
                    happening.id,
                    userId,
                );
                searchResults.push(event);
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

        const totalCount = await this.prismaService.happening.count({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        mapName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        author: {
                            username: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
                type: HappeningType.Run,
            },
        });

        const runIds = await this.prismaService.happening.findMany({
            select: {
                id: true,
                type: true,
            },
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        mapName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        author: {
                            username: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
                type: HappeningType.Run,
            },
            take: PER_PAGE,
            skip: page * PER_PAGE,
        });

        for (const { id } of runIds) {
            const run = await this.happeningsService.getRunById(id, userId);
            searchResults.push(run);
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

        const totalCount = await this.prismaService.happening.count({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        mapName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        author: {
                            username: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
                type: HappeningType.Event,
            },
        });

        const eventIds = await this.prismaService.happening.findMany({
            select: {
                id: true,
                type: true,
            },
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        mapName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        author: {
                            username: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
                type: HappeningType.Event,
            },
            take: PER_PAGE,
            skip: page * PER_PAGE,
        });

        for (const { id } of eventIds) {
            const event = await this.happeningsService.getEventById(id, userId);
            searchResults.push(event);
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

        const totalCount = await this.prismaService.user.count({
            where: {
                username: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
        });

        const userIds = await this.prismaService.user.findMany({
            select: {
                id: true,
            },
            where: {
                username: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            take: PER_PAGE,
            skip: page * PER_PAGE,
        });

        for (const { id } of userIds) {
            const profile = await this.usersService.searchUserById(id);

            if (profile) {
                profile.avatar = getAvatarUrl(profile.avatar);

                const isFollowing = await this.usersService.isFollowing(
                    userId,
                    profile.id,
                );

                searchResults.push({
                    type: 'User',
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
        switch (opts.sort) {
            case 'runs':
                return this.searchRuns(query, opts.page, userId);
            case 'events':
                return this.searchEvents(query, opts.page, userId);
            case 'users':
                return this.searchUsers(query, opts.page, userId);
            case 'all':
            default:
                return this.searchAll(query, opts.page, userId);
        }
    }
}
