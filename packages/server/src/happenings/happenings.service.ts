import { Injectable } from '@nestjs/common';
import {
    Happening,
    HappeningType,
    InterestedHappening,
    NotificationType,
    Place,
    Status,
} from '@prisma/client';
import { Status as HappeningStatus } from '@app/shared/types/Happening.type';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Run, Event } from '@app/shared/types/Happening.type';
import { EventDTO } from './dto/event.dto';
import { RunDTO } from './dto/run.dto';
import { createFile, deleteFile, FileTypeEnum } from 'src/utils/file.util';
import { ServersService } from 'src/servers/servers.service';
import { getAvatarUrl } from 'src/utils/user.util';

export class AllServersInUseError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AllServersInUseError";
    }
}

@Injectable()
export class HappeningsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly notificationsService: NotificationsService,
        private readonly serversService: ServersService,
    ) { }

    async createRun(data: RunDTO & { authorId: number }) {
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
        data: EventDTO & {
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

    async updateRun(runId: number, data: RunDTO) {
        await this.prismaService.happening.update({
            where: {
                id: runId
            },
            data: {
                ...data,
                place: data.place ? 'THERE' : 'HERE',
                startAt: new Date(data.startAt),
            },
        });
    }

    async updateEvent(
        happeningId: number,
        data: EventDTO & {
            thumbnail: Express.Multer.File | null;
        },
    ): Promise<void> {
        let oldThumbnail = await this.prismaService.happening.findFirst({
            where: {
                id: happeningId,
            },
            select: {
                thumbnail: true
            }
        });

        if (oldThumbnail?.thumbnail) {
            deleteFile(oldThumbnail.thumbnail, FileTypeEnum.Happening);
        }

        let filename: string | null = null;

        if (data.thumbnail) {
            filename = await createFile(data.thumbnail, FileTypeEnum.Happening);
        }

        await this.prismaService.happening.update({
            where: {
                id: happeningId
            },
            data: {
                ...data,
                thumbnail: filename,
                //@ts-ignore NOTE: you have to parseInt here coz when you send a multipart/form-data you lose int type :D
                place: parseInt(data.place) ? 'THERE' : 'HERE',
                endAt: data.endAt ? new Date(data.endAt) : null,
                startAt: new Date(data.startAt),
            },
        });
    }

    async startHappening(id: number): Promise<string | null> {
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

                let connectString = `connect ${serverData.ip}:${port}; password ${password}`;

                await this.prismaService.happening.update({
                    where: {
                        id,
                    },
                    data: {
                        status: 'Happening',
                        serverId,
                        connectString,
                    },
                });

                return connectString;
            }

            throw new AllServersInUseError();
        } else {
            await this.prismaService.happening.update({
                where: {
                    id,
                },
                data: {
                    status: 'Happening',
                },
            });

            return null;
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
    ): Promise<void> {
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

            await this.prismaService.interestedHappening.delete({
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
                connectString: true,
                interestedPlayers: {
                    select: {
                        userId: true,
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
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!run) {
            return null;
        }

        const {
            id,
            createdAt,
            _count,
            place,
            author,
            mapName,
            status,
            startAt,
            teamSize,
            connectString,
            description,
        } = run;
        const isInterested = !!run.interestedPlayers.length || false;
        const inTeam = run.interestedPlayers[0]?.inTeam || false;

        return {
            id,
            author: {
                id: author.id,
                avatar: getAvatarUrl(author.avatar),
                username: author.username
            },
            teamSize: teamSize!,
            status: status as HappeningStatus,
            connectString,
            createdAt: createdAt.toString(),
            startAt: startAt.toString(),
            description,
            _count,
            place,
            mapName,
            inTeam,
            isInterested,
        };
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
                connectString: true,
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
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!event) {
            return null;
        }

        const {
            id,
            status,
            author,
            startAt,
            description,
            createdAt,
            mapName,
            place,
            title,
            _count,
            endAt,
            connectString,
        } = event;
        let thumbnail: string | null = null;

        if (event?.thumbnail) {
            thumbnail = `${process.env.BASE_URL}/${process.env.HAPPENING_PATH}/${event.thumbnail}`;
        }

        const isInterested = !!event.interestedPlayers.length || false;
        const inTeam = event.interestedPlayers[0]?.inTeam || false;

        return {
            id,
            title: title!,
            author: {
                id: author.id,
                avatar: getAvatarUrl(author.avatar),
                username: author.username
            },
            connectString,
            place,
            mapName,
            description,
            status: status as HappeningStatus,
            createdAt: createdAt.toString(),
            startAt: startAt.toString(),
            endAt: endAt?.toString() || null,
            _count,
            inTeam,
            isInterested,
            thumbnail,
        };
    }

    async getAllRunsIds(): Promise<{ id: number }[]> {
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

    async getAllEventsIds(): Promise<{ id: number }[]> {
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
        const interestedPlayers = await this.prismaService.happening.findMany({
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

        for (let interestedPlayer of interestedPlayers[0]?.interestedPlayers || []) {
            interestedPlayer.user.avatar = getAvatarUrl(interestedPlayer.user.avatar);
        }

        return interestedPlayers;
    }

    async updateIsPlayerInTeam(happeningId: number, userId: number): Promise<void> {
        const { id, inTeam } =
            (await this.prismaService.interestedHappening.findFirst({
                where: {
                    happeningId,
                    userId,
                },
            }))!; //NOTE: this is fine

        await this.prismaService.interestedHappening.update({
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

    async updateStatus(id: number, status: Status): Promise<void> {
        await this.prismaService.happening.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    }

    async getHappeningType(id: number): Promise<HappeningType> {
        return (await this.prismaService.happening.findFirst({
            where: {
                id
            },
            select: {
                type: true
            }
        }))?.type!;
    }
}
