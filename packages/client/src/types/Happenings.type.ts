export enum Status {
    NotStarted = 'NotStarted',
    Happening = 'Happening',
    Finished = 'Finished',
}
export enum Happenings {
    Run,
    Event,
}

export type Place = 'HERE' | 'THERE';

export type Run = {
    id: number;
    place: Place;
    mapName: string;
    teamSize: number;
    status: Status;
    description: string;
    startAt: string;
    interestedPlayers: {
        inTeam: boolean;
    }[]; // this thing means if a user is interested in a run, is there's an object in an array then it's true
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
    title: string;
    thumbnail: string | null;
    endAt: string | null;
    status: Status;
    description: string;
    startAt: string;
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
