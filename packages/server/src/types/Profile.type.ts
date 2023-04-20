import { Role } from '@prisma/client';
import { Event, Run } from './Happenings.type';

export type Profile = {
    id: number;
    username: string;
    avatar: string | null;
    createdAt: Date;
    roles: Role[]; //TODO: WHAT'S THE TYPE OF IT?
    tier: number;
    verified: boolean;
    reviews: {
        id: number;
        review: string;
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
    _count: {
        followers: number;
        following: number;
        playedRuns: number;
        playedEvents: number;
    };
};
