import { Injectable, OnModuleInit } from '@nestjs/common';
import { HappeningsService } from 'src/happenings/happenings.service';

class Queue<T> {
    queue: T[] = [];

    enqueue(data: T) {
        this.queue.push(data);
    }

    dequeue(): T | null {
        return this.queue.shift() || null;
    }

    lenth() {
        return this.queue.length;
    }

    peek(): T | null {
        return this.queue[0] || null;
    }

    last(): T | null {
        return this.queue[this.queue.length - 1] || null;
    }
}

@Injectable()
export class CronService implements OnModuleInit {
    queue: Queue<{ id: number, startAt: Date }> = new Queue();

    constructor(
        private readonly happeningsService: HappeningsService,
    ) { }

    async onModuleInit() {
        let upcomingHappenings = await this.happeningsService.upcomingHappenings(10);

        for (let i = 0; i < upcomingHappenings.length; i++) {
            this.queue.enqueue(upcomingHappenings[i]);
        }

        setInterval(async () => {
            await this.check();
        }, 1000);
    }

    async check() {
        const happening = this.queue.peek();

        if (happening && new Date() > happening.startAt) {
            await this.happeningsService.startHappening(happening.id);

            this.queue.dequeue();

            const upcomingHappening = await this.happeningsService.nthUpcomingHappenings(10);
            if(upcomingHappening) this.queue.enqueue(upcomingHappening);

            await this.check();
        }
    }
}
