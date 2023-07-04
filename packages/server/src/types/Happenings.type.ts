import { Place, Status } from '@prisma/client';

type HappeningCommon = {
    id: number;
    place: Place;
    mapName: string;
    status: Status;
    createdAt: Date;
    interestedPlayers: {
        inTeam: boolean;
    }[];
    _count: {
        interestedPlayers: number;
    };
    author: {
        id: number;
        username: string;
        avatar: string | null;
    };
    startAt: Date;
};

export type Run = HappeningCommon & {
    teamSize: number;
};

export type Event = HappeningCommon & {
    thumbnail: string | null;
    endAt: Date | null;
};
