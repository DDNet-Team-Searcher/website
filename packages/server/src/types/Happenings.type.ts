import { Place, Status } from '@prisma/client';

export type Run = {
    id: number;
    place: Place;
    mapName: string;
    teamSize: number;
    status: Status;
    startAt: Date;
    interestedPlayers: {
        inTeam: boolean;
    }[];
    _count: {
        interestedPlayers: number;
    };
    server: {
        ip: string;
    };
    author: {
        id: number;
        username: string;
        avatar: string | null;
    };
};

export type Event = {
    id: number;
    place: Place;
    mapName: string;
    thumbnail: string | null;
    endAt: Date | null;
    status: Status;
    startAt: Date;
    interestedPlayers: {
        inTeam: boolean;
    }[];
    _count: {
        interestedPlayers: number;
    };
    server: {
        ip: string;
    };
    author: {
        id: number;
        username: string;
        avatar: string | null;
    };
};
