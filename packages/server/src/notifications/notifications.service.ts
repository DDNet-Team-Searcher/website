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
        type: NotificationType,
        notificationJson: NotificationJson,
    ): Promise<void> {
        const res = await this.prismaService.notification.create({
            data: {
                userId,
                type,
                notification: notificationJson,
            },
        });

        const notification = await this.getNotificationById(res.id);

        if (notification) {
            this.websocketGateway.sendNotification(userId, notification);
        }
    }

    async getNotificationById(
        notificationId: number,
    ): Promise<Notification | null> {
        const notification = await this.prismaService.notification.findFirst({
            where: {
                id: notificationId,
            },
        });

        if (!notification) {
            return null;
        }

        switch (notification.type as NotifType) {
            case NotificationType.AddedInTeam:
            case NotificationType.RemovedFromTeam: {
                const { authorId, ...happeningInfo } =
                    (await this.prismaService.happening.findFirst({
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
                    }))!; //NOTE: this is fine

                const author = (await this.prismaService.user.findFirst({
                    where: {
                        id: authorId,
                    },
                    select: {
                        username: true,
                        avatar: true,
                    },
                }))!; //NOTE: this is fine

                return {
                    author: {
                        username: author.username,
                        avatar: getAvatarUrl(author.username),
                    },
                    id: notification.id,
                    type: notification.type as
                        | NotifType.AddedInTeam
                        | NotifType.RemovedFromTeam,
                    seen: notification.seen,
                    happening: {
                        ...happeningInfo,
                        type: happeningInfo.type as Happenings,
                    },
                    notification: notification.notification as
                        | AddedInTeamNotification
                        | RemovedFromTeamNotification,
                    createdAt: notification.createdAt.toString(),
                };
            }
            case NotificationType.Followage: {
                const author = (await this.prismaService.user.findFirst({
                    where: {
                        id: (notification.notification as FollowNotification)
                            .userId,
                    },
                    select: {
                        username: true,
                        avatar: true,
                    },
                }))!; //NOTE: this is fine

                return {
                    author: {
                        username: author.username,
                        avatar: getAvatarUrl(author.avatar),
                    },
                    id: notification.id,
                    type: notification.type as NotifType.Followage,
                    seen: notification.seen,
                    notification:
                        notification.notification as FollowNotification,
                    createdAt: notification.createdAt.toString(),
                };
            }
            case NotificationType.InterestedInHappening: {
                const happeningInfo =
                    (await this.prismaService.happening.findFirst({
                        where: {
                            id: (
                                notification.notification as InterestedInHappeningNotification
                            ).happeningId,
                        },
                        select: {
                            mapName: true,
                            title: true,
                            type: true,
                        },
                    }))!; //NOTE: this is fine

                const author = (await this.prismaService.user.findFirst({
                    where: {
                        id: (
                            notification.notification as InterestedInHappeningNotification
                        ).userId,
                    },
                    select: {
                        username: true,
                        avatar: true,
                    },
                }))!; //NOTE: this is fine

                return {
                    author: {
                        username: author.username,
                        avatar: getAvatarUrl(author.avatar),
                    },
                    id: notification.id,
                    type: notification.type as NotifType.InterestedInHappening,
                    seen: notification.seen,
                    happening: {
                        ...happeningInfo,
                        type: happeningInfo.type as Happenings,
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
                return null;
        }
    }

    async getUserNotifications(userId: number): Promise<Notification[]> {
        const notifications = await this.prismaService.notification.findMany({
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

        const res: Notification[] = [];

        for (const notification of notifications) {
            const notif = await this.getNotificationById(notification.id);

            if (notif) {
                res.push(notif);
            }
        }

        return res;
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
