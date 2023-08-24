import { Injectable } from '@nestjs/common';
import {
    Happening,
    HappeningType,
    InterestedHappening,
    NotificationType,
    Place,
    Status,
} from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event, Run } from 'src/types/Happenings.type';
import { CreateEvenDTO } from './dto/create-event.dto';
import { CreateRunDTO } from './dto/create-run.dto';
import { createFile, deleteFile, FileTypeEnum } from 'src/utils/file.util';
import { ServersService } from 'src/servers/servers.service';

@Injectable()
export class HappeningsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly notificationsService: NotificationsService,
        private readonly serversService: ServersService,
    ) { }

    async createRun(data: CreateRunDTO & { authorId: number }) {
        return await this.prismaService.happening.create({
            data: {
                ...data,
                place: data.place ? 'THERE' : 'HERE',
                startAt: new Date(data.startAt),
                type: 'Run',
                interestedPlayers: {
                    create: {
                        userId: data.authorId,
                        inTeam: true,
                    },
                },
            },
        });
    }

    async createEvent(
        data: CreateEvenDTO & {
            authorId: number;
            thumbnail: Express.Multer.File | null;
        },
    ) {
        let filename: string | null = null;

        if (data.thumbnail) {
            filename = await createFile(data.thumbnail, FileTypeEnum.Happening);
        }

        return await this.prismaService.happening.create({
            data: {
                ...data,
                thumbnail: filename,
                //@ts-ignore NOTE: you have to parseInt here coz when you send a multipart/form-data you lose int type :D
                place: parseInt(data.place) ? 'THERE' : 'HERE',
                endAt: data.endAt ? new Date(data.endAt) : null,
                startAt: new Date(data.startAt),
                type: 'Event',
                interestedPlayers: {
                    create: {
                        userId: data.authorId,
                        inTeam: true,
                    },
                },
            },
        });
    }

    async startHappening(id: number): Promise<boolean> {
        const happeningPlace = await this.getHappeningPlace(id);

        if (happeningPlace === 'HERE') {
            const serverId = await this.serversService.findEmptyServer();
            const mapName = (await this.prismaService.happening.findFirst({
                where: {
                    id,
                },
                select: {
                    mapName: true,
                },
            }))!.mapName;

            if (serverId) {
                const serverData = (await this.serversService.getServerData(
                    serverId,
                ))!; //NOTE: this is fine
                const { port, password } =
                    await this.serversService.startServer(serverId, {
                        mapName,
                        id,
                    });

                await this.prismaService.happening.update({
                    where: {
                        id,
                    },
                    data: {
                        status: 'Happening',
                        serverId,
                        connectString: `connect ${serverData.ip}:${port}; password ${password}`,
                    },
                });

                return true;
            }

            return false;
        } else {
            await this.prismaService.happening.update({
                where: {
                    id,
                },
                data: {
                    status: 'Happening',
                },
            });

            return true;
        }
    }

    async endHappening(id: number): Promise<Happening> {
        const happeningPlace = await this.getHappeningPlace(id);
        if (happeningPlace == 'HERE') {
            const serverId = (await this.prismaService.happening.findFirst({
                where: {
                    id,
                },
                select: {
                    serverId: true,
                },
            }))!.serverId;

            await this.serversService.shutdownServer(serverId!, id);

            return await this.prismaService.happening.update({
                where: {
                    id,
                },
                data: {
                    status: 'Finished',
                    serverId: null,
                    connectString: null,
                },
            });
        } else {
            return await this.prismaService.happening.update({
                where: {
                    id,
                },
                data: {
                    status: 'Finished',
                },
            });
        }
    }

    async deleteHappening(id: number): Promise<Happening> {
        const happening = await this.prismaService.happening.delete({
            where: {
                id,
            },
        });

        if (happening.thumbnail) {
            await deleteFile(happening.thumbnail, FileTypeEnum.Happening);
        }

        return happening;
    }

    async getHappeningPlace(id: number): Promise<Place | null> {
        return (
            (
                await this.prismaService.happening.findFirst({
                    where: {
                        id,
                    },
                    select: {
                        place: true,
                    },
                })
            )?.place || null
        );
    }

    async isUserInterestedHappening({
        userId,
        happeningId,
    }: {
        userId: number;
        happeningId: number;
    }): Promise<InterestedHappening | null> {
        return await this.prismaService.interestedHappening.findFirst({
            where: {
                happeningId,
                userId,
            },
        });
    }

    async setIsUserInterestedInHappening(
        happeningId: number,
        userId: number,
        isInterested: boolean,
    ) {
        if (isInterested) {
            const author = (await this.prismaService.happening.findFirst({
                where: {
                    id: happeningId,
                },
                select: {
                    authorId: true,
                },
            }))!; //NOTE: ThIs Is FiNe

            await this.prismaService.interestedHappening.create({
                data: {
                    userId,
                    happeningId,
                },
            });

            await this.notificationsService.sendNotification(
                author.authorId,
                NotificationType.InterestedInHappening,
                { happeningId, userId },
            );
        } else {
            const data = (await this.isUserInterestedHappening({
                userId,
                happeningId,
            }))!; //NOTE: ThIs Is FiNe

            return await this.prismaService.interestedHappening.delete({
                where: {
                    id: data.id,
                },
            });
        }
    }

    async getRunById(runId: number, userId: number): Promise<Run | null> {
        const run = await this.prismaService.happening.findFirst({
            where: {
                type: 'Run',
                id: runId,
            },
            select: {
                id: true,
                place: true,
                mapName: true,
                teamSize: true,
                description: true,
                status: true,
                startAt: true,
                createdAt: true,
                interestedPlayers: {
                    select: {
                        inTeam: true,
                    },
                    where: {
                        userId,
                    },
                },
                _count: {
                    select: {
                        interestedPlayers: true,
                    },
                },
                server: {
                    select: {
                        ip: true,
                        port: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (run) {
            const isInterested = !!run?.interestedPlayers?.length || false;
            const inTeam = run?.interestedPlayers[0]?.inTeam || false;

            //@ts-ignore
            delete run.interestedPlayers;

            return {
                ...run,
                inTeam,
                isInterested
            };
        }

        return null;
    }

    async getEventById(eventId: number, userId: number): Promise<Event | null> {
        const event = await this.prismaService.happening.findFirst({
            where: {
                type: 'Event',
                id: eventId,
            },
            select: {
                id: true,
                place: true,
                title: true,
                mapName: true,
                status: true,
                startAt: true,
                description: true,
                endAt: true,
                thumbnail: true,
                createdAt: true,
                interestedPlayers: {
                    select: {
                        inTeam: true,
                    },
                    where: {
                        userId,
                    },
                },
                _count: {
                    select: {
                        interestedPlayers: true,
                    },
                },
                server: {
                    select: {
                        ip: true,
                        port: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (event) {
            let thumbnail: string | null = null;

            if (event?.thumbnail) {
                thumbnail = `${process.env.BASE_URL}/${process.env.HAPPENING_PATH}/${event.thumbnail}`;
            }

            const isInterested = !!event?.interestedPlayers?.length || false;
            const inTeam = event?.interestedPlayers[0]?.inTeam || false;

            //@ts-ignore
            delete event.interestedPlayers;

            return {
                ...event,
                inTeam,
                isInterested,
                thumbnail,
            };
        }

        return null;
    }

    async getAllRunsIds() {
        return await this.prismaService.happening.findMany({
            where: {
                type: 'Run',
                NOT: {
                    status: 'Finished',
                },
            },
            select: {
                id: true,
            },
        });
    }

    async getAllEventsIds() {
        return await this.prismaService.happening.findMany({
            where: {
                type: 'Event',
                NOT: {
                    status: 'Finished',
                },
            },
            select: {
                id: true,
            },
        });
    }

    async getRecentRunsIds(
        id: number,
        runsCount = 5,
    ): Promise<{ id: number }[]> {
        return await this.prismaService.happening.findMany({
            where: {
                type: 'Run',
                authorId: id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: runsCount,
            select: {
                id: true,
            },
        });
    }

    async getRecentEventsIds(
        id: number,
        eventsCount = 5,
    ): Promise<{ id: number }[]> {
        return await this.prismaService.happening.findMany({
            where: {
                type: 'Event',
                authorId: id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: eventsCount,
            select: {
                id: true,
            },
        });
    }

    async countLastFinishedHappenings(
        authorId: number,
        type: HappeningType,
    ): Promise<number> {
        return this.prismaService.happening.count({
            where: {
                authorId,
                type,
                status: Status.Finished,
            },
        });
    }

    async getHappeningInterestedPlayers(id: number) {
        return this.prismaService.happening.findMany({
            where: {
                id,
            },
            select: {
                interestedPlayers: {
                    select: {
                        inTeam: true,
                        user: {
                            select: {
                                id: true,
                                avatar: true,
                                username: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        interestedPlayers: true,
                    },
                },
            },
        });
    }

    async updateIsPlayerInTeam(happeningId: number, userId: number) {
        const { id, inTeam } =
            (await this.prismaService.interestedHappening.findFirst({
                where: {
                    happeningId,
                    userId,
                },
            }))!; //NOTE: this is fine

        return await this.prismaService.interestedHappening.update({
            where: {
                id,
            },
            data: {
                inTeam: !inTeam,
            },
        });
    }

    async upcomingHappenings(n: number) {
        return await this.prismaService.happening.findMany({
            where: {
                status: 'NotStarted',
            },
            orderBy: {
                startAt: 'asc',
            },
            select: {
                id: true,
                startAt: true,
                status: true,
            },
            take: n,
        });
    }

    async nthUpcomingHappenings(n: number) {
        return await this.prismaService.happening.findFirst({
            where: {
                status: 'NotStarted',
            },
            orderBy: {
                startAt: 'asc',
            },
            select: {
                id: true,
                startAt: true,
                status: true,
            },
            skip: n,
        });
    }

    async updateStatus(id: number, status: Status) {
        await this.prismaService.happening.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    }
}
