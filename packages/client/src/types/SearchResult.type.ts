import { Run as RunT, Event as EventT } from '@app/shared/types/Happening.type';

type Run = { type: 'run' } & RunT;
type Event = { type: 'event' } & EventT;

type UserT = {
    username: string;
    avatar: string | null;
    tier: number;
    id: number;
    verified: boolean;
    _count: {
        followers: number;
        following: number;
    };
    isFollowing: boolean;
};

export type UserSearchResult = { type: 'user' } & UserT;

export type SearchResult = Run | Event | UserSearchResult;
