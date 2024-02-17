import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'net';
import { Request_Action, Request } from 'src/protos/request';
import { Response, Response_ResponseCode } from 'src/protos/response';
import { Origin } from 'src/protos/common';
import { Status } from '@prisma/client';

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

    constructor(
        private readonly prismaService: PrismaService,
        private readonly logger: Logger,
    ) {
        this.sockets = new Map();
        this.failed = new Map();
    }

    async onModuleInit(): Promise<void> {
        const servers = await this.getAllServers();

        for (let i = 0; i < servers.length; i++) {
            const { ip, port, id } = servers[i];
            const socket = new Socket();

            await new Promise<void>((res) => {
                socket.connect(port, ip, async () => {
                    //TODO: fix this bs
                    this.logger.verbose(
                        `TCP connection established with ${ip}:${port}`,
                    );

                    const server = {
                        socket,
                        max: 0,
                        used: 0,
                    };

                    this.sockets.set(id, server);

                    const { used, max } =
                        await this.getServerDataAboutHowManyServersItCanRunButThisMethodNameSeemsBigIllLeaveItLikeThis(
                            id,
                        );

                    server.used = used;
                    server.max = max;

                    res();
                });

                socket.on('error', (err) => {
                    this.logger.warn(err);

                    this.sockets.delete(id);
                    this.failed.set(servers[i].id, { ip, port });
                    res();
                });

                socket.on('close', () => {
                    this.logger.verbose('Connection closed');
                });

                socket.on('data', async (bytes) => {
                    const response = Response.decode(bytes);

                    if (response.origin == Origin.DDNET && response.data?.$case === "shutdown") {
                        await this.prismaService.happening.update({
                            where: {
                                id: response.data.shutdown.id,
                            },
                            data: {
                                status: Status.Finished,
                            },
                        });
                    }
                });
            });
        }
    }

    getAllServers(): Promise<{ id: number; ip: string; port: number }[]> {
        return this.prismaService.server.findMany({
            select: {
                id: true,
                ip: true,
                port: true,
            },
        });
    }

    async getServerData(
        id: number,
    ): Promise<{ ip: string; port: number } | null> {
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
            const server = this.sockets.get(serverId);

            if (!server) {
                throw new Error('whoopsie daisy');
            }

            const socket = server.socket;

            const request = Request.create({
                origin: Origin.NOT_DDNET,
                action: Request_Action.INFO,
            });

            socket.write(Request.encode(request).finish());

            const handler = (bytes: Buffer) => {
                //FIXME: error handling left the code
                const response = Response.decode(bytes);

                if (response.code == Response_ResponseCode.OK && response.data?.$case === 'info') {
                    res({
                        used: response.data.info.used!,
                        max: response.data.info.max!,
                    });
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
            const server = this.sockets.get(serverId);

            if (!server) {
                throw new Error('whoopsie daisy');
            }

            const socket = server.socket;

            const request = Request.create({
                action: Request_Action.START,
                mapName: data.mapName,
                origin: Origin.NOT_DDNET,
                id: data.id,
            });

            socket.write(Request.encode(request).finish());

            const handler = (bytes: Buffer) => {
                //FIXME: error handling left the code
                const response = Response.decode(bytes);

                if (response.code == Response_ResponseCode.OK && response.data?.$case === 'start') {
                    res({
                        port: response.data.start.port!,
                        password: response.data.start.password!,
                    });
                } else {
                    console.log('Couldnt start the game server');
                }

                socket.removeListener('data', handler);
            };

            socket.on('data', handler);
        });
    }

    shutdownServer(serverId: number, happeningId: number): Promise<void> {
        return new Promise<void>((res) => {
            const server = this.sockets.get(serverId);

            if (!server) {
                throw new Error('whoopsie daisy');
            }

            const socket = server.socket;

            const request = Request.create({
                action: Request_Action.SHUTDOWN,
                origin: Origin.NOT_DDNET,
                id: happeningId,
            });

            socket.write(Request.encode(request).finish());

            const handler = (bytes: Buffer) => {
                //FIXME: error handling left the code
                const response = Response.decode(bytes);

                if (response.code == Response_ResponseCode.OK) {
                    res();
                } else {
                    console.log('Couldnt shutdown the server owo');
                }

                socket.removeListener('data', handler);
            };

            socket.on('data', handler);
        });
    }
}
