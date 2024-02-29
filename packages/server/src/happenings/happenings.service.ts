import { Injectable } from '@nestjs/common';
import {
    Happening,
    HappeningType,
    InterestedHappening,
    NotificationType,
    Place,
    Status,
} from '@prisma/client';
import {
    Status as HappeningStatus,
    Run,
    Event,
    Happenings,
} from '@app/shared/types/Happening.type';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventDTO } from './dto/event.dto';
import { RunDTO } from './dto/run.dto';
import { createFile, deleteFile, FileTypeEnum } from 'src/utils/file.util';
import { ServersService } from 'src/servers/servers.service';
import { getAvatarUrl } from 'src/utils/user.util';
import { NotificationType as NotifType } from '@app/shared/types/Notification.type';
import { Happening as HappeningT } from '@app/shared/types/Happening.type';
import { InterestedPlayer } from '@app/shared/types/api.type';

export class AllServersInUseError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'AllServersInUseError';
    }
}

@Injectable()
export class HappeningsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly notificationsService: NotificationsService,
        private readonly serversService: ServersService,
    ) {}

    async exists(id: number): Promise<boolean> {
        return this.prismaService.exists(this.prismaService.happening, {
            where: {
                id,
            },
        });
    }

    async createRun(data: RunDTO & { authorId: number }): Promise<Happening> {
        return await this.prismaService.happening.create({
            data: {
                ...data,
                place: data.place ? Place.THERE : Place.HERE,
                startAt: new Date(data.startAt),
                type: HappeningType.Run,
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
    ): Promise<Happening> {
        let filename: string | null = null;

        if (data.thumbnail) {
            filename = await createFile(data.thumbnail, FileTypeEnum.Happening);
        }

        return await this.prismaService.happening.create({
            data: {
                ...data,
                thumbnail: filename,
                //NOTE: you have to parseInt here coz when you send a multipart/form-data you lose int type :D
                place: parseInt(data.place) ? Place.THERE : Place.HERE,
                endAt: data.endAt ? new Date(data.endAt) : null,
                startAt: new Date(data.startAt),
                type: HappeningType.Event,
                interestedPlayers: {
                    create: {
                        userId: data.authorId,
                        inTeam: true,
                    },
                },
            },
        });
    }

    async updateRun(runId: number, data: RunDTO): Promise<void> {
        await this.prismaService.happening.update({
            where: {
                id: runId,
            },
            data: {
                ...data,
                place: data.place ? Place.THERE : Place.HERE,
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
        const oldThumbnail = await this.prismaService.happening.findFirst({
            where: {
                id: happeningId,
            },
            select: {
                thumbnail: true,
            },
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
                id: happeningId,
            },
            data: {
                ...data,
                thumbnail: filename,
                //NOTE: you have to parseInt here coz when you send a multipart/form-data you lose int type :D
                place: parseInt(data.place) ? Place.THERE : Place.HERE,
                endAt: data.endAt ? new Date(data.endAt) : null,
                startAt: new Date(data.startAt),
            },
        });
    }

    async startHappening(id: number): Promise<string | null> {
        const happeningPlace = await this.getHappeningPlace(id);

        if (happeningPlace === Place.HERE) {
            const serverId = await this.serversService.findEmptyServer();

            if (serverId) {
                const { mapName } =
                    await this.prismaService.happening.findFirstOrThrow({
                        where: {
                            id,
                        },
                        select: {
                            mapName: true,
                        },
                    });
                const serverData = await this.serversService.getServerData(
                    serverId,
                );
                const { port, password } =
                    await this.serversService.startServer(serverId, {
                        mapName,
                        id,
                    });
                const connectString = `connect ${serverData.ip}:${port}; password ${password}`;

                await this.prismaService.happening.update({
                    where: {
                        id,
                    },
                    data: {
                        status: Status.Happening,
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
                    status: Status.Happening,
                },
            });

            return null;
        }
    }

    async endHappening(id: number): Promise<Happening> {
        const happeningPlace = await this.getHappeningPlace(id);

        if (happeningPlace == Place.HERE) {
            const { serverId } =
                await this.prismaService.happening.findFirstOrThrow({
                    where: {
                        id,
                    },
                    select: {
                        serverId: true,
                    },
                });

            await this.serversService.shutdownServer(serverId!, id);

            return await this.prismaService.happening.update({
                where: {
                    id,
                },
                data: {
                    status: Status.Finished,
                    serverId: null,
                    connectString: null,
                },
            });
        } else if (happeningPlace === Place.THERE) {
            return await this.prismaService.happening.update({
                where: {
                    id,
                },
                data: {
                    status: Status.Finished,
                },
            });
        }

        throw new Error('bad place type');
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

    async getHappeningPlace(id: number): Promise<Place> {
        const { place } = await this.prismaService.happening.findFirstOrThrow({
            where: {
                id,
            },
            select: {
                place: true,
            },
        });

        return place;
    }

    async isUserInterestedHappening({
        userId,
        happeningId,
    }: {
        userId: number;
        happeningId: number;
    }): Promise<boolean> {
        return this.prismaService.exists(
            this.prismaService.interestedHappening,
            {
                where: {
                    userId,
                    happeningId,
                },
            },
        );
    }

    async setIsUserInterestedInHappening(
        happeningId: number,
        userId: number,
        isInterested: boolean,
    ): Promise<void> {
        if (isInterested) {
            const { authorId } =
                await this.prismaService.happening.findFirstOrThrow({
                    where: {
                        id: happeningId,
                    },
                    select: {
                        authorId: true,
                    },
                });

            await this.prismaService.interestedHappening.create({
                data: {
                    userId,
                    happeningId,
                },
            });

            await this.notificationsService.sendNotification(authorId, {
                type: NotificationType.InterestedInHappening as NotifType.InterestedInHappening,
                data: {
                    happeningId,
                    userId,
                },
            });
        } else {
            await this.prismaService.interestedHappening.delete({
                where: {
                    userId_happeningId: {
                        userId,
                        happeningId,
                    },
                },
            });
        }
    }

    /*
     * You better check the run id you pass in, or nothing good will happen
     */
    async getRunById(runId: number, userId: number): Promise<Run> {
        const run = await this.prismaService.happening.findFirstOrThrow({
            where: {
                type: HappeningType.Run,
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
        const playersCountInTeam =
            await this.prismaService.interestedHappening.count({
                where: {
                    happeningId: runId,
                    inTeam: true,
                },
            });

        return {
            id,
            author: {
                id: author.id,
                avatar: getAvatarUrl(author.avatar),
                username: author.username,
            },
            teamSize: teamSize!,
            status: status as HappeningStatus,
            connectString,
            createdAt: createdAt.toString(),
            startAt: startAt.toString(),
            type: HappeningType.Run as Happenings.Run,
            description,
            _count: {
                interestedPlayers: _count.interestedPlayers,
                inTeam: playersCountInTeam,
            },
            place,
            mapName,
            inTeam,
            isInterested,
        };
    }

    /*
     * You better check the run id you pass in, or nothing good will happen
     */
    async getEventById(eventId: number, userId: number): Promise<Event> {
        const event = await this.prismaService.happening.findFirstOrThrow({
            where: {
                type: HappeningType.Event,
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
        const isInterested = !!event.interestedPlayers.length || false;
        const inTeam = event.interestedPlayers[0]?.inTeam || false;
        let thumbnail: string | null = null;

        if (event?.thumbnail) {
            thumbnail = `${process.env.BASE_URL}/${process.env.HAPPENING_PATH}/${event.thumbnail}`;
        }

        return {
            id,
            title: title!,
            author: {
                id: author.id,
                avatar: getAvatarUrl(author.avatar),
                username: author.username,
            },
            connectString,
            place,
            mapName,
            description,
            type: HappeningType.Event as Happenings.Event,
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
                type: HappeningType.Run,
                NOT: {
                    status: Status.Finished,
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
                type: HappeningType.Event,
                NOT: {
                    status: Status.Finished,
                },
            },
            select: {
                id: true,
            },
        });
    }

    async getHappeningInterestedPlayers(
        id: number,
    ): Promise<InterestedPlayer[]> {
        const interestedPlayers =
            await this.prismaService.interestedHappening.findMany({
                where: {
                    happeningId: id,
                },
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
            });

        for (const interestedPlayer of interestedPlayers) {
            interestedPlayer.user.avatar = getAvatarUrl(
                interestedPlayer.user.avatar,
            );
        }

        return interestedPlayers;
    }

    async updateIsPlayerInTeam(
        happeningId: number,
        userId: number,
    ): Promise<void> {
        const { inTeam } =
            await this.prismaService.interestedHappening.findFirstOrThrow({
                where: {
                    happeningId,
                    userId,
                },
            });

        await this.prismaService.interestedHappening.update({
            where: {
                userId_happeningId: {
                    userId,
                    happeningId,
                },
            },
            data: {
                inTeam: !inTeam,
            },
        });

        if (inTeam) {
            await this.notificationsService.sendNotification(userId, {
                type: NotificationType.RemovedFromTeam as NotifType.RemovedFromTeam,
                data: {
                    happeningId,
                },
            });
        } else {
            await this.notificationsService.sendNotification(userId, {
                type: NotificationType.AddedInTeam as NotifType.AddedInTeam,
                data: {
                    happeningId,
                },
            });
        }
    }

    async upcomingHappenings(): Promise<
        { id: number; startAt: Date; status: Status }[]
    > {
        return await this.prismaService.happening.findMany({
            where: {
                OR: [{ status: Status.NotStarted }, { status: Status.InQueue }],
                startAt: {
                    lte: new Date(),
                },
            },
            orderBy: {
                startAt: 'asc',
            },
            select: {
                id: true,
                startAt: true,
                status: true,
            },
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
        const { type } = await this.prismaService.happening.findFirstOrThrow({
            where: {
                id,
            },
            select: {
                type: true,
            },
        });

        return type;
    }

    async findUserHappenings(
        authedUserId: number,
        userId: number,
        opts: {
            type?: HappeningType;
            status?: Status;
            query?: string;
        },
    ) {
        const { query, ...options } = opts;

        const data = await this.prismaService.happening.findMany({
            select: {
                id: true,
                type: true,
            },
            where: {
                OR: query
                    ? [
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
                      ]
                    : undefined,
                ...options,
                authorId: userId,
            },
            take: 10,
        });

        const happenings: HappeningT[] = [];

        for (const el of data) {
            if (el.type == HappeningType.Run) {
                happenings.push(await this.getRunById(el.id, authedUserId));
            } else if (el.type == HappeningType.Event) {
                happenings.push(await this.getEventById(el.id, authedUserId));
            }
        }

        return happenings;
    }
}
