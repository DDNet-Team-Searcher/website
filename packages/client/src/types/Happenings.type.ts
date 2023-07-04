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

type HappeningCommon = {
    id: number;
    place: Place;
    mapName: string;
    description: string;
    startAt: string;
    status: Status;
    createdAt: string;
    interestedPlayers: {
        inTeam: boolean;
    }[]; // this thing means if a user is interested in a run, is there's an object in an array then it's true
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
