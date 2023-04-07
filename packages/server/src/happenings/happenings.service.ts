import { Injectable } from '@nestjs/common';
import { Happening, InterestedHappening } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event, Run } from 'src/types/Happenings.type';
import { CreateEvenDTO } from './dto/create-event.dto';
import { CreateRunDTO } from './dto/create-run.dto';

@Injectable()
export class HappeningsService {
    constructor(private readonly prismaService: PrismaService) { }

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
        data: CreateEvenDTO & { authorId: number; thumbnail: string | null },
    ) {
        return await this.prismaService.happening.create({
            data: {
                ...data,
                place: data.place ? 'THERE' : 'HERE',
                endAt: new Date(data.endAt),
                startAt: new Date(data.startAt),
                type: 'Event',
            },
        });
    }

    async startHappening(id: number): Promise<Happening> {
        return await this.prismaService.happening.update({
            where: {
                id,
            },
            data: {
                status: 'Happening',
            },
        });
    }

    async endHappening(id: number): Promise<Happening> {
        return await this.prismaService.happening.update({
            where: {
                id,
            },
            data: {
                status: 'Finished',
            },
        });
    }

    async deleteHappening(id: number): Promise<Happening> {
        return await this.prismaService.happening.delete({
            where: {
                id,
            },
        });
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
            return await this.prismaService.interestedHappening.create({
                data: {
                    userId,
                    happeningId,
                },
            });
        } else {
            const data = await this.isUserInterestedHappening({
                userId,
                happeningId,
            });

            return await this.prismaService.interestedHappening.delete({
                where: {
                    id: data.id,
                },
            });
        }
    }

    async getRunById(runId: number, userId: number): Promise<Run | null> {
        return await this.prismaService.happening.findFirst({
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
    }

    async getEventById(eventId: number, userId: number): Promise<Event | null> {
        return await this.prismaService.happening.findFirst({
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
    }

    async getAllRuns(id: number): Promise<Run[]> {
        return await this.prismaService.happening.findMany({
            where: {
                type: 'Run',
            },
            select: {
                id: true,
                place: true,
                mapName: true,
                teamSize: true,
                description: true,
                status: true,
                startAt: true,
                interestedPlayers: {
                    select: {
                        inTeam: true,
                    },
                    where: {
                        userId: id,
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
    }

    async getAllEvents(id: number): Promise<Event[]> {
        return await this.prismaService.happening.findMany({
            where: {
                type: 'Event',
            },
            select: {
                id: true,
                title: true,
                place: true,
                mapName: true,
                status: true,
                startAt: true,
                description: true,
                endAt: true,
                thumbnail: true,
                interestedPlayers: {
                    select: {
                        inTeam: true,
                    },
                    where: {
                        userId: id,
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
        const {id, inTeam} = await this.prismaService.interestedHappening.findFirst({
            where: {
                happeningId,
                userId
            }
        });

        return await this.prismaService.interestedHappening.update({
            where: {
                id
            },
            data: {
                inTeam: !inTeam
            }
        });
    }
}
