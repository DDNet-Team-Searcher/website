import { Happenings } from './Happening.type';

export enum NotificationType {
    Follow = 'Follow',
    Unfollow = 'Unfollow',
    InterestedInHappening = 'InterestedInHappening',
    AddedInTeam = 'AddedInTeam',
    RemovedFromTeam = 'RemovedFromTeam',
    NoEmptyServers = 'NoEmptyServers',
}

export type FollowNotification = {
    userId: number;
}

export type UnfollowNotification = FollowNotification;

export type AddedInTeamNotification = {
    happeningId: number;
}

export type RemovedFromTeamNotification = AddedInTeamNotification;

export type InterestedInHappeningNotification = {
    userId: number;
    happeningId: number;
}

export type NoEmptyServersNotification = {}

export type NotificationJson =
    {
        type: NotificationType.Follow,
        data: FollowNotification
    } | {
        type: NotificationType.Unfollow,
        data: UnfollowNotification
    } | {
        type: NotificationType.AddedInTeam,
        data: AddedInTeamNotification
    } | {
        type: NotificationType.RemovedFromTeam,
        data: RemovedFromTeamNotification
    } | {
        type: NotificationType.InterestedInHappening,
        data: InterestedInHappeningNotification
    } | {
        type: NotificationType.NoEmptyServers,
        data: NoEmptyServersNotification;
    }

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

type Common<N extends Record<string, string | number>, T extends NotificationType> = {
    id: number;
    notification: N;
    createdAt: string;
    type: T;
    seen: boolean;
};

export type Notification =
    (Common<FollowNotification, NotificationType.Follow> & Author)
    | (Common<UnfollowNotification, NotificationType.Unfollow> & Author)
    | (Common<InterestedInHappeningNotification, NotificationType.InterestedInHappening> & Author & Happening)
    | (Common<AddedInTeamNotification, NotificationType.AddedInTeam> & Author & Happening)
    | (Common<RemovedFromTeamNotification, NotificationType.RemovedFromTeam> & Author & Happening)
    | Common<NoEmptyServersNotification, NotificationType.NoEmptyServers>;
