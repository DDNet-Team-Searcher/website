import { Run, Event } from './Happening.type';

type User = {
    username: string;
    avatar: string | null;
    tier: number;
    id: number;
    _count: {
        followers: number;
        following: number;
    };
    isFollowing: boolean;
};

export type SearchResult =
    | ({ type: 'user' } & User)
    | ({ type: 'run' } & Run)
    | ({ type: 'event' } & Event);
