import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServersService {
    constructor(private readonly prismaService: PrismaService) { }

    getAllServers() {
        return this.prismaService.server.findMany({
            select: {
                id: true,
                ip: true,
                port: true,
            },
        });
    }

    async findEmptyServer(): Promise<number | null> {
        const server: { id: number } | undefined = (
            await this.prismaService.$queryRaw<{ id: number }>`
            SELECT id FROM "Server"
            WHERE (
                SELECT COUNT(*) FROM "Happening" WHERE "Happening"."serverId" = "Server".id
            ) < "Server"."serversRunningMax" LIMIT 1
        `
        )[0];

        return server?.id || null;
    }

    async getServerData(id: number) {
        return this.prismaService.server.findFirst({
            where: {
                id,
            },
            select: {
                ip: true,
                port: true,
            },
        });
    }
}
