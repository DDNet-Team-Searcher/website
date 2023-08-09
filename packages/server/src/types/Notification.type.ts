import {
    Notification as PrismaNotification,
    NotificationType,
    HappeningType,
} from '@prisma/client';

//NOTE: You better dont see what's going on here. It's just full ANARCHY.
//But if you need you refactor it. God bless your soul to not break all this shit

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
        type: HappeningType;
    };
};

type IdkHowToCallIt<T extends NotificationType> = Omit<
    PrismaNotification,
    'notification'
> & {
    type: T;
    notification: NotificationJson<T>;
};

export type Notification =
    | (IdkHowToCallIt<Extract<NotificationType, 'Followage'>> &
          Author &
          Happening)
    | (IdkHowToCallIt<Extract<NotificationType, 'AddedInTeam'>> &
          Author &
          Happening)
    | (IdkHowToCallIt<Extract<NotificationType, 'RemovedFromTeam'>> &
          Author &
          Happening)
    | (IdkHowToCallIt<Extract<NotificationType, 'InterestedInHappening'>> &
          Author &
          Happening)
    | IdkHowToCallIt<Extract<NotificationType, 'MadeAnAccountPOG'>>;
