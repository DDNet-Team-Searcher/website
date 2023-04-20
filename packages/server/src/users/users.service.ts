import { Injectable } from '@nestjs/common';
import { HappeningType } from '@prisma/client';
import { HappeningsService } from 'src/happenings/happenings.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile } from 'src/types/Profile.type';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private prismaService: PrismaService,
        private happeningService: HappeningsService
    ) { }

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

    async getUserById(id: number) {
        return this.prismaService.user.findFirst({
            where: {
                id,
            },
        });
    }

    async register(data: RegisterUserDTO) {
        return await this.prismaService.user.create({
            data,
        });
    }

    async getUserProfile(id: number): Promise<null | Profile> {
        const profile = await this.prismaService.user.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                createdAt: true,
                roles: true,
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
                                avatar: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        followers: true,
                        following: true
                    }
                }
            }
        });

        const runs = await this.happeningService.getRecentRuns(id);
        const events = await this.happeningService.getRecentEvents(id);

        const playedRuns = await this.happeningService.countLastFinishedHappenings(id, HappeningType.Run);
        const playedEvents = await this.happeningService.countLastFinishedHappenings(id, HappeningType.Event);

        return {
            ...profile,
            happenings: {
                runs,
                events
            },
            _count: {
                ...profile._count,
                playedRuns,
                playedEvents
            }
        }

    }
}
