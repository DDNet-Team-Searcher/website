import { Happenings } from './Happening.type';

//NOTE: god bless your fucking soul if you have to edit this shit

export enum NotificationType {
    Followage = 'Followage',
    InterestedInHappening = 'InterestedInHappening',
    AddedInTeam = 'AddedInTeam',
    RemovedFromTeam = 'RemovedFromTeam',
    MadeAnAccountPOG = 'MadeAnAccountPOG',
    NoEmptyServers = 'NoEmptyServers',
}

export type NotificationJson<T = NotificationType> =
    T extends NotificationType.Followage
        ? {
              userId: number;
          }
        : T extends NotificationType.AddedInTeam
        ? {
              happeningId: number;
          }
        : T extends NotificationType.RemovedFromTeam
        ? {
              happeningId: number;
          }
        : T extends NotificationType.InterestedInHappening
        ? {
              userId: number;
              happeningId: number;
          }
        : T extends NotificationType.MadeAnAccountPOG
        ? {}
        : T extends NotificationType.NoEmptyServers
        ? {}
        : {}; // this looks stupid, ngl

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
    | (Common<NotificationType.Followage> & Author)
    | (Common<NotificationType.InterestedInHappening> & Author & Happening)
    | (Common<NotificationType.AddedInTeam> & Author & Happening)
    | (Common<NotificationType.RemovedFromTeam> & Author & Happening)
    | Common<NotificationType.MadeAnAccountPOG>
    | Common<NotificationType.NoEmptyServers>;
