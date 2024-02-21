import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NotificationType, Status } from '@prisma/client';
import {
    AllServersInUseError,
    HappeningsService,
} from 'src/happenings/happenings.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType as NotifType } from '@app/shared/types/Notification.type';

@Injectable()
export class CronService implements OnModuleInit {
    constructor(
        private readonly happeningsService: HappeningsService,
        private readonly notificationsService: NotificationsService,
        private readonly logger: Logger,
    ) {}

    async onModuleInit() {
        setInterval(async () => {
            await this.check();
        }, 60 * 1000);
    }

    async check(): Promise<void> {
        const happenings = await this.happeningsService.upcomingHappenings();

        for (const happening of happenings) {
            try {
                await this.happeningsService.startHappening(happening.id);
            } catch (e) {
                if (e instanceof AllServersInUseError) {
                    const playersInTeam = (
                        await this.happeningsService.getHappeningInterestedPlayers(
                            happening.id,
                        )
                    )[0];

                    if (happening.status == Status.NotStarted) {
                        for (const user of playersInTeam.interestedPlayers) {
                            if (user.inTeam) {
                                await this.notificationsService.sendNotification(
                                    user.user.id,
                                    {
                                        type: NotificationType.NoEmptyServers as NotifType.NoEmptyServers,
                                        data: {},
                                    },
                                );
                            }
                        }

                        await this.happeningsService.updateStatus(
                            happening.id,
                            Status.InQueue,
                        );
                    }
                } else {
                    this.logger.error(e);
                }
            }
        }
    }
}
