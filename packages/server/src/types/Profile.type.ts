import type { Role, RolesOnUsers} from '@prisma/client';
import type { Event, Run } from './Happenings.type';

export type Profile = {
    id: number;
    username: string;
    avatar: string | null;
    createdAt: Date;
    roles: {role: Role}[]; //TODO: WHAT'S THE TYPE OF IT?
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
