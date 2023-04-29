import { Injectable } from '@nestjs/common';
import { NotificationType, HappeningType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationJson } from 'src/types/NotificationJson.type';
import { WebsocketsGateway } from 'src/websockets/websockets.gateway';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly websocketGateway: WebsocketsGateway,
    ) {}

    async sendNotification<T extends NotificationType>(
        userId: number,
        type: T,
        notification: NotificationJson<T>,
    ) {
        const res = await this.prismaService.notification.create({
            data: {
                userId,
                type,
                notification,
            },
        });

        this.websocketGateway.sendNotification(userId, res);
    }

    async getUserNotifications(userId: number) {
        const notifications = await this.prismaService.notification.findMany({
            take: 10,
            where: {
                userId,
            },
        });

        for (const notification of notifications) {
            if (
                notification.type === NotificationType.AddedInTeam ||
                notification.type === NotificationType.RemovedFromTeam
            ) {
                const { authorId, ...happeningInfo } =
                    await this.prismaService.happening.findFirst({
                        where: {
                            //@ts-ignore
                            id: notification.notification.happeningId,
                        },
                        select: {
                            authorId: true,
                            mapName: true,
                            title: true,
                            type: true,
                        },
                    });

                //@ts-ignore
                notification.happening = happeningInfo;

                const author = await this.prismaService.user.findFirst({
                    where: {
                        id: authorId,
                    },
                });
                //@ts-ignore
                notification.author = author;
            } else if (notification.type === NotificationType.Followage) {
                const author = await this.prismaService.user.findFirst({
                    where: {
                        //@ts-ignore
                        id: notification.notification.authorId,
                    },
                    select: {
                        username: true,
                        avatar: true,
                    },
                });
                //@ts-ignore
                notification.author = author;
            } else if (
                notification.type === NotificationType.InterestedInHappening
            ) {
                const happeningInfo =
                    await this.prismaService.happening.findFirst({
                        where: {
                            //@ts-ignore
                            id: notification.notification.happeningId,
                        },
                        select: {
                            mapName: true,
                            title: true,
                            type: true,
                        },
                    });

                //@ts-ignore
                notification.happening = happeningInfo;

                const author = await this.prismaService.user.findFirst({
                    where: {
                        //@ts-ignore
                        id: notification.notification.userId,
                    },
                    select: {
                        username: true,
                        avatar: true,
                    },
                });
                //@ts-ignore
                notification.author = author;
            }
        }

        return notifications;
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
