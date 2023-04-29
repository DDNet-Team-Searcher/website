import type { Notification } from '@prisma/client';

export type User = {
    id: number;
    username: string;
    email: string;
    tier: number;
    createdAt: Date;
    updatedAt: Date;
    verified: boolean;
    avatar: string | null;
    notifications: Notification[];
    _count: { unreadNotifications: number };
    permissions: {
        canBan: boolean;
        canDeleteHappenings: boolean;
        canManageRoles: boolean;
        canManagePosts: boolean;
    };
    bans: {
        isBanned: boolean;
        reason: string | null;
    };
};
