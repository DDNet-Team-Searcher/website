export enum Status {
    NotStarted = 'NotStarted',
    Happening = 'Happening',
    Finished = 'Finished',
    InQueue = 'InQueue',
}

export enum Happenings {
    Run = 'Run',
    Event = 'Event',
}

export type Place = 'HERE' | 'THERE';

type HappeningCommon = {
    id: number;
    place: Place;
    mapName: string;
    description: string | null;
    startAt: string;
    status: Status;
    createdAt: string;
    inTeam: boolean;
    isInterested: boolean;
    _count: {
        interestedPlayers: number;
    };
    connectString: string | null;
    author: {
        id: number;
        username: string;
        avatar: string | null;
    };
};

export type Run = HappeningCommon & {
    teamSize: number;
};

export type Event = HappeningCommon & {
    title: string;
    thumbnail: string | null;
    endAt: string | null;
};
