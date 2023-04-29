import { Happenings } from './Happenings.type';

export enum NotificationType {
    Followage = 'Followage',
    InterestedInHappening = 'InterestedInHappening',
    AddedInTeam = 'AddedInTeam',
    RemovedFromTeam = 'RemovedFromTeam',
    MadeAnAccountPOG = 'MadeAnAccountPOG',
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

type Common<T extends NotificationType> = {
    id: number;
    notification: {}; //FIXME: Im lazy ass and i dont want to fuck with this type >:(
    type: T;
    createdAt: string;
    seen: boolean;
};

//TODO: Maybe fix this shit, hello?
export type Notification =
    | (Common<NotificationType.InterestedInHappening> & Author & Happening)
    | (Common<NotificationType.AddedInTeam> & Happening);
