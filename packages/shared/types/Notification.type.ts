import { Happenings } from './Happening.type';

export enum NotificationType {
    Followage = 'Followage',
    InterestedInHappening = 'InterestedInHappening',
    AddedInTeam = 'AddedInTeam',
    RemovedFromTeam = 'RemovedFromTeam',
    MadeAnAccountPOG = 'MadeAnAccountPOG',
    NoEmptyServers = 'NoEmptyServers',
}

export type FollowNotification = {
    userId: number;
}

export type AddedInTeamNotification = {
    happeningId: number;
}

export type RemovedFromTeamNotification = {
    happeningId: number;
}

export type InterestedInHappeningNotification = {
    userId: number;
    happeningId: number;
}

export type NewAccountNotification = {}

export type NoEmptyServersNotification = {}

export type NotificationJson =
    FollowNotification |
    AddedInTeamNotification |
    RemovedFromTeamNotification |
    InterestedInHappeningNotification |
    NewAccountNotification |
    NoEmptyServersNotification;

type Author = {
    author: {
        username: string;
        avatar: string | null;
    };
};

type Happening = {
    happening: {
        mapName: string;
        title: string | null;
        type: Happenings;
    };
};

type Common<N extends Record<string, any>, T extends NotificationType> = {
    id: number;
    notification: N;
    createdAt: string;
    type: T;
    seen: boolean;
};

export type Notification =
    (Common<FollowNotification, NotificationType.Followage> & Author)
    | (Common<InterestedInHappeningNotification, NotificationType.InterestedInHappening> & Author & Happening)
    | (Common<AddedInTeamNotification, NotificationType.AddedInTeam> & Author & Happening)
    | (Common<RemovedFromTeamNotification, NotificationType.RemovedFromTeam> & Author & Happening)
    | Common<NewAccountNotification, NotificationType.MadeAnAccountPOG>
    | Common<NoEmptyServersNotification, NotificationType.NoEmptyServers>;
