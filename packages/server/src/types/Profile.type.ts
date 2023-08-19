import type { Role } from '@prisma/client';
import type { Event, Run } from './Happenings.type';

export type Profile = {
    id: number;
    username: string;
    avatar: string | null;
    createdAt: Date;
    roles: { role: Pick<Role, 'id' | 'name' | 'url' | 'color'> }[];
    tier: number;
    verified: boolean;
    reviews: {
        id: number;
        review: string | null;
        rate: number;
        createdAt: Date;
        author: {
            id: number;
            username: string;
            avatar: string | null;
        };
    }[];
    happenings: {
        events: Event[];
        runs: Run[];
    };
    isFollowing: boolean;
    _count: {
        followers: number;
        following: number;
        playedRuns: number;
        playedEvents: number;
    };
};
