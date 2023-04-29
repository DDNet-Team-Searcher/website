import { Injectable } from '@nestjs/common';
import { HappeningType } from '@prisma/client';
import { HappeningsService } from 'src/happenings/happenings.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile } from 'src/types/Profile.type';
import { User } from 'src/types/User.type';
import { computePersmissions } from 'src/utils/computedFields';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly happeningService: HappeningsService,
        private readonly notificationsService: NotificationsService
    ) {}

    async isUserExists(
        args: Parameters<UsersService['prismaService']['user']['count']>[0],
    ): Promise<Boolean> {
        return this.prismaService.exists(this.prismaService.user, args);
    }

    async getUserByEmail(email: string) {
        return this.prismaService.user.findFirst({
            where: {
                email,
            },
        });
    }

    async getUserCredentials(id: number): Promise<User> {
        const credentials = await this.prismaService.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                tier: true,
                createdAt: true,
                updatedAt: true,
                verified: true,
                avatar: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                canBan: true,
                                canManagePosts: true,
                                canManageRoles: true,
                                canDeleteHappenings: true,
                            },
                        },
                    },
                },
                // notifications: {
                //     orderBy: {
                //         createdAt: 'desc',
                //     },
                // },
            },
        });

        const unreadNotificationsCount =
            await this.prismaService.notification.count({
                where: {
                    userId: id,
                    seen: false,
                },
            });

        const notifications = await this.notificationsService.getUserNotifications(id);

        const res = {
            ...credentials,
            notifications,
            _count: { unreadNotifications: unreadNotificationsCount },
        };

        return computePersmissions(res);
    }

    async register(data: RegisterUserDTO) {
        return await this.prismaService.user.create({
            data,
        });
    }

    async getUserProfile(id: number): Promise<null | Profile> {
        const profile = await this.prismaService.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                createdAt: true,
                roles: {
                    select: {
                        role: true,
                    },
                },
                tier: true,
                verified: true,
                reviews: {
                    take: 5,
                    select: {
                        id: true,
                        review: true,
                        rate: true,
                        createdAt: true,
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        });

        const runs = await this.happeningService.getRecentRuns(id);
        const events = await this.happeningService.getRecentEvents(id);

        const playedRuns =
            await this.happeningService.countLastFinishedHappenings(
                id,
                HappeningType.Run,
            );
        const playedEvents =
            await this.happeningService.countLastFinishedHappenings(
                id,
                HappeningType.Event,
            );

        return {
            ...profile,
            happenings: {
                runs,
                events,
            },
            _count: {
                ...profile._count,
                playedRuns,
                playedEvents,
            },
        };
    }
}
