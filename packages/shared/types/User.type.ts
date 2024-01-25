import { Notification } from "./Notification.type";
import { Role } from "./Role.type";

export type User = {
    id: number;
    username: string;
    email: string;
    tier: number;
    createdAt: string;
    updatedAt: string;
    role: keyof typeof Role | null;
    avatar: string | null;
    notifications: Notification[];
    _count: { unreadNotifications: number };
    banned: {
        isBanned: boolean;
        reason: string | null;
    };
};
