import { Injectable } from '@nestjs/common';
import { HappeningType, Status } from '@prisma/client';
import { HappeningsService } from 'src/happenings/happenings.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile } from '@app/shared/types/Profile.type';
import { User } from '@app/shared/types/User.type';
import { createFile, deleteFile, FileTypeEnum } from 'src/utils/file.util';
import { RegisterUserDTO } from './dto/register-user.dto';
import * as argon2 from 'argon2';
import { getAvatarUrl } from 'src/utils/user.util';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@app/shared/types/Role.type';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ProfileReview } from '@app/shared/types/Review.type';
import { Happening } from '@app/shared/types/Happening.type';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly happeningService: HappeningsService,
        private readonly reviewsService: ReviewsService,
        private readonly notificationsService: NotificationsService,
    ) {}

    async isUserExists(
        args: Parameters<UsersService['prismaService']['user']['count']>[0],
    ): Promise<boolean> {
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
        const {
            username,
            tier,
            email,
            createdAt,
            updatedAt,
            role,
            ...credentials
        } = (await this.prismaService.user.findFirst({
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
                role: true,
                avatar: true,
                bans: {
                    take: 1,
                    select: {
                        reason: true,
                    },
                },
            },
        }))!; //NOTE: this is fine

        const unreadNotificationsCount =
            await this.prismaService.notification.count({
                where: {
                    userId: id,
                    seen: false,
                },
            });

        const notifications =
            await this.notificationsService.getUserNotifications(id);

        const banned: User['banned'] = {
            isBanned: false,
            reason: null,
        };

        if (credentials.bans.length) {
            banned.isBanned = true;
            banned.reason = credentials.bans[0].reason;
        }

        return {
            id,
            username,
            tier,
            email,
            role,
            avatar: getAvatarUrl(credentials.avatar),
            notifications,
            updatedAt: updatedAt.toString(),
            createdAt: createdAt.toString(),
            banned,
            _count: { unreadNotifications: unreadNotificationsCount },
        };
    }

    async register(data: RegisterUserDTO): Promise<string> {
        const activationCode = uuidv4();

        await this.prismaService.user.create({
            data: {
                ...data,
                activationCode,
            },
        });

        return activationCode;
    }

    async searchUserById(id: number) {
        return (await this.prismaService.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                tier: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        }))!; //NOTE: this is fine
    }

    /*
     * userId - id of user youre trying to find
     * id - if of user who is looking for it
     */
    async getUserProfile(userId: number, id: number): Promise<null | Profile> {
        const profile = await this.prismaService.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                createdAt: true,
                tier: true,
                role: true,
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
                bans: {
                    take: 1,
                    select: {
                        banned: true,
                    },
                    where: {
                        banned: true,
                    },
                },
            },
        });

        if (!profile) {
            return null;
        }

        const {
            id: profileUserId,
            avatar,
            createdAt,
            tier,
            role,
            username,
            _count: { followers, following },
        } = profile;

        const isFollowing = await this.isFollowing(userId, id);
        const isReported = await this.isReported(id, userId);

        //TODO: return boolean only to users who can ban
        //return null for others
        return {
            id: profileUserId,
            username,
            tier,
            role,
            createdAt: createdAt.toString(),
            avatar: getAvatarUrl(avatar),
            _count: {
                followers,
                following,
            },
            isFollowing,
            isReported,
            isBanned: profile.bans[0]?.banned ? true : false,
        };
    }

    async isFollowing(
        followerId: number,
        followingId: number,
    ): Promise<boolean> {
        const bool = await this.prismaService.follower.count({
            where: {
                followerId,
                followingId,
            },
        });

        return Boolean(bool);
    }

    async follow(followerId: number, followingId: number): Promise<void> {
        if (await this.isFollowing(followerId, followingId)) {
            // unfollow
            await this.prismaService.follower.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId,
                    },
                },
            });
        } else {
            //follow
            await this.prismaService.follower.create({
                data: {
                    followerId,
                    followingId,
                },
            });
        }
    }

    async updateAvatar(
        id: number,
        avatar: Express.Multer.File,
    ): Promise<string> {
        const filename = await createFile(avatar, FileTypeEnum.Avatar);
        const oldAvatar = (await this.prismaService.user.findFirst({
            where: {
                id,
            },
            select: {
                avatar: true,
            },
        }))!;

        if (oldAvatar.avatar)
            await deleteFile(oldAvatar.avatar, FileTypeEnum.Avatar);

        await this.prismaService.user.update({
            where: {
                id,
            },
            data: {
                avatar: filename,
            },
        });

        return filename;
    }

    async updateUsername(
        id: number,
        data: { username: string; password: string },
    ): Promise<boolean> {
        const { password } = (await this.prismaService.user.findFirst({
            where: {
                id,
            },
        }))!;

        if (await argon2.verify(password, data.password)) {
            await this.prismaService.user.update({
                where: { id },
                data: {
                    username: data.username,
                },
            });

            return true;
        } else {
            return false;
        }
    }

    async updateEmail(
        id: number,
        data: { email: string; password: string },
    ): Promise<boolean> {
        const { password } = (await this.prismaService.user.findFirst({
            where: {
                id,
            },
        }))!;

        if (await argon2.verify(password, data.password)) {
            await this.prismaService.user.update({
                where: { id },
                data: {
                    email: data.email,
                },
            });

            return true;
        } else {
            return false;
        }
    }

    async updatePassword(
        id: number,
        data: { old: string; new: string },
    ): Promise<boolean> {
        const { password } = (await this.prismaService.user.findFirst({
            where: {
                id,
            },
        }))!;

        if (await argon2.verify(password, data.old)) {
            await this.prismaService.user.update({
                where: { id },
                data: {
                    password: await argon2.hash(data.new),
                },
            });

            return true;
        } else {
            return false;
        }
    }

    async report(
        reportedUserId: number,
        authorId: number,
        reason: string,
    ): Promise<void> {
        await this.prismaService.report.create({
            data: {
                reportedUserId,
                authorId,
                report: reason,
            },
        });
    }

    async isReported(
        reportedUserId: number,
        authorId: number,
    ): Promise<boolean> {
        const res = await this.prismaService.report.findFirst({
            where: {
                authorId,
                reportedUserId,
            },
        });

        return res === null ? false : true;
    }

    async isBanned(bannedUserId: number): Promise<boolean> {
        const res = await this.prismaService.ban.findFirst({
            where: {
                userId: bannedUserId,
                banned: true,
            },
        });

        return res === null ? false : true;
    }

    async ban(
        userIdToBan: number,
        authorId: number,
        reason: string,
    ): Promise<void> {
        await this.prismaService.ban.create({
            data: {
                reason,
                banned: true,
                userId: userIdToBan,
                authorId,
            },
        });
    }

    async unban(bannedUserId: number): Promise<void> {
        const ban = await this.prismaService.ban.findFirst({
            where: {
                userId: bannedUserId,
                banned: true,
            },
            select: {
                id: true,
            },
        });

        await this.prismaService.ban.update({
            where: {
                id: ban!.id,
            },
            data: {
                banned: false,
            },
        });
    }

    async activateAccount(code: string): Promise<boolean> {
        const user = await this.prismaService.user.findFirst({
            where: {
                activationCode: code,
            },
        });

        if (user && !user?.activated) {
            await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    activated: true,
                },
            });

            return true;
        }

        return false;
    }

    async role(userId: number): Promise<keyof typeof Role | null> {
        return (await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                role: true,
            },
        }))!.role;
        // ^ is this gud?
    }

    async happenings(
        authedUserId: number,
        userId: number,
        opts: {
            type?: HappeningType;
            status?: Status;
            query?: string;
        },
    ): Promise<Happening[]> {
        return await this.happeningService.findUserHappenings(
            authedUserId,
            userId,
            opts,
        );
    }

    async reviews(id: number): Promise<ProfileReview[]> {
        return await this.reviewsService.reviewsAboutUser(id);
    }
}
