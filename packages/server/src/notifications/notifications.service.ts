import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Notification } from 'src/types/Notification.type';
import { NotificationJson } from 'src/types/Notification.type';
import { WebsocketsGateway } from 'src/websockets/websockets.gateway';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly websocketGateway: WebsocketsGateway,
    ) { }

    async sendNotification<T extends NotificationType>(
        userId: number,
        type: T,
        notificationJson: NotificationJson<T>,
    ) {
        const res = await this.prismaService.notification.create({
            data: {
                userId,
                type,
                notification: notificationJson,
            },
        });

        const notification = await this.getNotificationById(res.id);

        this.websocketGateway.sendNotification(userId, notification);
    }

    async getNotificationById(notificationId: number) {
        let notification = await this.prismaService.notification.findFirst({
            where: {
                id: notificationId,
            },
        }) as Notification;

        if (
            notification.type === NotificationType.AddedInTeam ||
            notification.type === NotificationType.RemovedFromTeam
        ) {
            const { authorId, ...happeningInfo } =
                await this.prismaService.happening.findFirst({
                    where: {
                        id: notification.notification.happeningId,
                    },
                    select: {
                        authorId: true,
                        mapName: true,
                        title: true,
                        type: true,
                    },
                });

            notification.happening = happeningInfo;

            const author = await this.prismaService.user.findFirst({
                where: {
                    id: authorId,
                },
            });

            notification.author = author;
        } else if (notification.type === NotificationType.Followage) {
            const author = await this.prismaService.user.findFirst({
                where: {
                    id: notification.notification.userId,
                },
                select: {
                    username: true,
                    avatar: true,
                },
            });

            notification.author = author;
        } else if (
            notification.type === NotificationType.InterestedInHappening
        ) {
            const happeningInfo = await this.prismaService.happening.findFirst({
                where: {
                    id: notification.notification.happeningId,
                },
                select: {
                    mapName: true,
                    title: true,
                    type: true,
                },
            });

            notification.happening = happeningInfo;

            const author = await this.prismaService.user.findFirst({
                where: {
                    id: notification.notification.userId,
                },
                select: {
                    username: true,
                    avatar: true,
                },
            });

            notification.author = author;
        }

        return notification;
    }

    async getUserNotifications(userId: number) {
        const notifications = await this.prismaService.notification.findMany({
            take: 10,
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });

        const res = [];

        for (let notification of notifications) {
            res.push(await this.getNotificationById(notification.id));
        }

        return res;
    }

    async markAsSeen(id: number) {
        return await this.prismaService.notification.update({
            where: { id },
            data: {
                seen: true,
            },
        });
    }
}
