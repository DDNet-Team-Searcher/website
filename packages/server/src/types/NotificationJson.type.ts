import { NotificationType } from '@prisma/client';

export type NotificationJson<T = NotificationType> =
    T extends typeof NotificationType.Followage
        ? {
              userId: number;
          }
        : T extends typeof NotificationType.AddedInTeam
        ? {
              happeningId: number;
          }
        : T extends typeof NotificationType.RemovedFromTeam
        ? {
              happeningId: number;
          }
        : T extends typeof NotificationType.MadeAnAccountPOG
        ? null
        : T extends typeof NotificationType.InterestedInHappening
        ? {
              userId: number;
              happeningId: number;
          }
        : never;
