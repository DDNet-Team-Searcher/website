import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'net';

type SocketResponse =
    | {
        status: 'SERVER_STARTED_SUCCESSFULLY';
        pid: number;
        id: number;
        password: string;
        port: number;
    }
    | {
        status: 'SERVER_SHUTDOWN_SUCCESSFULLY';
        pid: number;
    }
    | {
        status: 'SOMETHING_HAPPENNED_IDK_MYSELF';
    };

type Host = {
    ip: string;
    port: number;
};

type Server = {
    socket: Socket;
    used: number;
    max: number;
};

@Injectable()
export class ServersService {
    sockets: Map<number, Server>;
    failed: Map<number, Host>;

    constructor(private readonly prismaService: PrismaService) {
        this.sockets = new Map();
        this.failed = new Map();
    }

    async onModuleInit() {
        const servers = await this.getAllServers();

        for (let i = 0; i < servers.length; i++) {
            const { ip, port, id } = servers[i];
            const socket = new Socket();

            await new Promise<void>((res) => {
                socket.connect(port, ip, async () => {
                    const server = {
                        socket,
                        max: 0,
                        used: 0,
                    };
                    this.sockets.set(id, server);

                    const { used, max } = await this.getServerDataAboutHowManyServersItCanRunButThisMethodNameSeemsBigIllLeaveItLikeThis(id);
                    server.used = used;
                    server.max = max;

                    this.sockets.set(id, server);

                    console.log(
                        `TCP connection established with ${ip}:${port}`,
                    );
                    res();
                });

                socket.on('error', (err) => {
                    console.log(
                        `Uh oh, we are fucked lmao. Couldnt connect to ${ip}:${port}`,
                    );
                    console.log(err);

                    this.sockets.delete(id);
                    this.failed.set(servers[i].id, { ip, port });
                    res();
                });

                socket.on('data', async (bytes) => {
                    let res: SocketResponse = JSON.parse(
                        Buffer.from(bytes).toString(),
                    );

                    if (res.status === 'SERVER_SHUTDOWN_SUCCESSFULLY') {
                        //TODO: idk how but here should be handled responses from the rust server which will be triggered by ddnet server
                        //ddnet server sends a request to rust server and then rust server sends data here :deadge:
                    } else if (
                        res.status === 'SOMETHING_HAPPENNED_IDK_MYSELF'
                    ) {
                    }
                });
            });
        }
    }

    getAllServers() {
        return this.prismaService.server.findMany({
            select: {
                id: true,
                ip: true,
                port: true,
            },
        });
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

    async findEmptyServer(): Promise<number | null> {
        for (const [key, server] of this.sockets) {
            if (server.used < server.max) {
                return key;
            }
        }

        return null;
    }

    async getServerDataAboutHowManyServersItCanRunButThisMethodNameSeemsBigIllLeaveItLikeThis(
        serverId: number,
    ): Promise<{ used: number; max: number }> {
        return new Promise((res) => {
            const socket = this.sockets.get(serverId)?.socket!;

            socket.write(
                Buffer.from(
                    JSON.stringify({
                        action: 'INFO',
                    }) + '\n',
                ),
            );

            const handler = (bytes: Buffer) => {
                //FIXME: error handling left the code
                const { status, ...data } = JSON.parse(bytes.toString());

                if (status == 'INFO_SUCCESS') {
                    res(data);
                }

                socket.removeListener('data', handler);
            };

            socket.on('data', handler);
        });
    }

    async startServer(
        serverId: number,
        data: { mapName: string; id: number },
    ): Promise<{ port: number; password: string }> {
        return new Promise((res) => {
            const socket = this.sockets.get(serverId)?.socket!;

            socket.write(
                Buffer.from(
                    JSON.stringify({
                        action: 'START',
                        map_name: data.mapName,
                        id: data.id,
                    }) + '\n',
                ),
            );

            const handler = (bytes: Buffer) => {
                //FIXME: error handling left the code
                const { status, ...data } = JSON.parse(bytes.toString());

                if (status == 'SERVER_STARTED_SUCCESSFULLY') {
                    res(data);
                }

                socket.removeListener('data', handler);
            };

            socket.on('data', handler);
        });
    }

    shutdownServer(serverId: number, happeningId: number) {
        return new Promise<void>((res) => {
            const socket = this.sockets.get(serverId)?.socket!;

            socket.write(
                Buffer.from(
                    JSON.stringify({ action: 'SHUTDOWN', id: happeningId }) +
                    '\n',
                ),
            );

            const handler = (bytes: Buffer) => {
                const { status } = JSON.parse(bytes.toString());
                console.log(status);

                if (status == 'SERVER_SHUTDOWN_SUCCESSFULLY') {
                    res();
                }

                socket.removeListener('data', handler);
            };

            socket.on('data', handler);
        });
    }
}
