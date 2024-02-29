import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import {
    AddedInTeamNotification,
    FollowNotification,
    InterestedInHappeningNotification,
    NoEmptyServersNotification,
    NotificationType as NotifType,
    RemovedFromTeamNotification,
} from '@app/shared/types/Notification.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { Notification } from '@app/shared/types/Notification.type';
import { NotificationJson } from '@app/shared/types/Notification.type';
import { WebsocketsGateway } from 'src/websockets/websockets.gateway';
import { Happenings } from '@app/shared/types/Happening.type';
import { getAvatarUrl } from 'src/utils/user.util';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly websocketGateway: WebsocketsGateway,
    ) {}

    async sendNotification(
        userId: number,
        data: NotificationJson,
    ): Promise<void> {
        const res = await this.prismaService.notification.create({
            data: {
                userId,
                type: data.type,
                notification: data.data,
            },
        });

        const notification = await this.getNotificationById(res.id);

        this.websocketGateway.sendNotification(userId, notification);
    }

    async getNotificationById(notificationId: number): Promise<Notification> {
        const notification =
            await this.prismaService.notification.findFirstOrThrow({
                where: {
                    id: notificationId,
                },
            });

        switch (notification.type as NotifType) {
            case NotificationType.AddedInTeam:
            case NotificationType.RemovedFromTeam: {
                const happening = await this.prismaService.happening.findFirst({
                    where: {
                        id: (
                            notification.notification as AddedInTeamNotification
                        ).happeningId,
                    },
                    select: {
                        authorId: true,
                        mapName: true,
                        title: true,
                        type: true,
                    },
                });

                const author = await this.prismaService.user.findFirst({
                    where: {
                        id: happening?.authorId || -1,
                    },
                    select: {
                        username: true,
                        avatar: true,
                    },
                });

                return {
                    user: {
                        id: happening?.authorId || null,
                        username: author?.username || null,
                        avatar: getAvatarUrl(author?.avatar || null),
                    },
                    id: notification.id,
                    type: notification.type as
                        | NotifType.AddedInTeam
                        | NotifType.RemovedFromTeam,
                    seen: notification.seen,
                    happening: {
                        title: happening?.title || null,
                        mapName: happening?.mapName || null,
                        type: (happening?.type as Happenings) || null,
                    },
                    notification: notification.notification as
                        | AddedInTeamNotification
                        | RemovedFromTeamNotification,
                    createdAt: notification.createdAt.toString(),
                };
            }
            case NotificationType.Unfollow:
            case NotificationType.Follow: {
                const author = await this.prismaService.user.findFirst({
                    where: {
                        id: (notification.notification as FollowNotification)
                            .userId,
                    },
                    select: {
                        username: true,
                        avatar: true,
                    },
                });

                return {
                    user: {
                        id: (notification.notification as FollowNotification)
                            .userId,
                        username: author?.username || null,
                        avatar: getAvatarUrl(author?.avatar || null),
                    },
                    id: notification.id,
                    type: notification.type as NotifType.Follow,
                    seen: notification.seen,
                    notification:
                        notification.notification as FollowNotification,
                    createdAt: notification.createdAt.toString(),
                };
            }
            case NotificationType.InterestedInHappening: {
                const happening = await this.prismaService.happening.findFirst({
                    where: {
                        id: (
                            notification.notification as AddedInTeamNotification
                        ).happeningId,
                    },
                    select: {
                        authorId: true,
                        mapName: true,
                        title: true,
                        type: true,
                    },
                });

                const author = await this.prismaService.user.findFirst({
                    where: {
                        id: happening?.authorId || -1,
                    },
                    select: {
                        username: true,
                        avatar: true,
                    },
                });

                return {
                    user: {
                        id: happening?.authorId || null,
                        username: author?.username || null,
                        avatar: getAvatarUrl(author?.avatar || null),
                    },
                    id: notification.id,
                    type: notification.type as NotifType.InterestedInHappening,
                    seen: notification.seen,
                    happening: {
                        title: happening?.title || null,
                        mapName: happening?.mapName || null,
                        type: (happening?.type as Happenings) || null,
                    },
                    notification:
                        notification.notification as InterestedInHappeningNotification,
                    createdAt: notification.createdAt.toString(),
                };
            }
            case NotificationType.NoEmptyServers: {
                return {
                    id: notification.id,
                    type: notification.type as NotifType.NoEmptyServers,
                    seen: notification.seen,
                    notification:
                        notification.notification as NoEmptyServersNotification,
                    createdAt: notification.createdAt.toString(),
                };
            }
            default:
                throw new Error('Wrong notification type');
        }
    }

    async getUserNotifications(userId: number): Promise<Notification[]> {
        const ids = await this.prismaService.notification.findMany({
            take: 10,
            where: {
                userId,
            },
            select: {
                id: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const notifications: Notification[] = [];

        for (const { id } of ids) {
            const notification = await this.getNotificationById(id);

            notifications.push(notification);
        }

        return notifications;
    }

    async markAsSeen(id: number): Promise<void> {
        await this.prismaService.notification.update({
            where: { id },
            data: {
                seen: true,
            },
        });
    }
}
