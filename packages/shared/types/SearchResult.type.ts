import { Run, Event } from './Happening.type';

export type User = {
    username: string;
    avatar: string | null;
    tier: number;
    id: number;
    _count: {
        followers: number;
        following: number;
    };
    isFollowing: boolean;
    type: 'User';
};

export type SearchResult =
    | User
    | Run
    | Event;
