import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationType, Status } from '@prisma/client';
import { HappeningsService } from 'src/happenings/happenings.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class CronService implements OnModuleInit {
    happenings: { id: number; startAt: Date; status: Status }[];

    constructor(
        private readonly happeningsService: HappeningsService,
        private readonly notificationsService: NotificationsService,
    ) { }

    async onModuleInit() {
        let upcomingHappenings =
            await this.happeningsService.upcomingHappenings(10);

        this.happenings = upcomingHappenings;

        setInterval(async () => {
            await this.check();
        }, 1000);
    }

    //FIXME: when user changes happening info it doesnt update here
    //and it starts with old date
    async check(): Promise<void> {
        for (const happening of this.happenings) {
            if (happening && new Date() > happening.startAt) {
                const success = await this.happeningsService.startHappening(
                    happening.id,
                );

                if (success) {
                    this.happenings.shift();

                    const upcomingHappening =
                        await this.happeningsService.nthUpcomingHappenings(10);
                    if (upcomingHappening)
                        this.happenings.push(upcomingHappening);

                    await this.check();
                } else {
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
                                    NotificationType.NoEmptyServers,
                                    {},
                                );
                            }
                        }

                        await this.happeningsService.updateStatus(
                            happening.id,
                            Status.InQueue,
                        );

                        happening.status = Status.InQueue;
                        await this.check();
                    }
                }
            }
        }
    }
}
