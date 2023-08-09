import { Happenings } from './Happenings.type';

export enum NotificationType {
    Followage = 'Followage',
    InterestedInHappening = 'InterestedInHappening',
    AddedInTeam = 'AddedInTeam',
    RemovedFromTeam = 'RemovedFromTeam',
    MadeAnAccountPOG = 'MadeAnAccountPOG',
    NoEmptyServers = 'NoEmptyServers',
}

export type NotificationJson<T = NotificationType> = T extends Extract<
    NotificationType,
    'Followage'
>
    ? {
          userId: number;
      }
    : T extends Extract<NotificationType, 'AddedInTeam'>
    ? {
          happeningId: number;
      }
    : T extends Extract<NotificationType, 'RemovedFromTeam'>
    ? {
          happeningId: number;
      }
    : T extends Extract<NotificationType, 'InterestedInHappening'>
    ? {
          userId: number;
          happeningId: number;
      }
    : T extends Extract<NotificationType, 'MadeAnAccountPOG'>
    ? {}
    : T extends Extract<NotificationType, 'NoEmptyServers'>
    ? {}
    : never;

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

type Common<T extends NotificationType> = {
    id: number;
    notification: NotificationJson<T>;
    type: T;
    createdAt: string;
    seen: boolean;
};

export type Notification =
    | (Common<NotificationType.Followage> & Author & Happening)
    | (Common<NotificationType.InterestedInHappening> & Author & Happening)
    | (Common<NotificationType.AddedInTeam> & Author & Happening)
    | (Common<NotificationType.RemovedFromTeam> & Author & Happening)
    | Common<NotificationType.MadeAnAccountPOG>
    | Common<NotificationType.NoEmptyServers>;
