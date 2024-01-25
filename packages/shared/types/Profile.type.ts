import { Event, Run } from './Happening.type';
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
    reviews: {
        id: number;
        review: string | null;
        createdAt: string;
        rate: number;
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
    _count: {
        followers: number;
        following: number;
        playedRuns: number;
        playedEvents: number;
    };
    isBanned: boolean | null;
};
