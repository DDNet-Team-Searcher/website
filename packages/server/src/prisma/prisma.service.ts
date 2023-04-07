import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }

    async exists<T extends { count: any }>(
        model: T,
        args: Parameters<T['count']>[0],
    ): Promise<boolean> {
        const count = await model.count(args);

        return Boolean(count);
    }
}
