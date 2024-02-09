import { Role } from './Role.type';

export type Profile = {
    id: number;
    username: string;
    avatar: string | null;
    createdAt: string;
    tier: number;
    role: keyof typeof Role | null;
    isFollowing: boolean;
    isReported: boolean;
    _count: {
        followers: number;
        following: number;
    };
    isBanned: boolean | null;
};
