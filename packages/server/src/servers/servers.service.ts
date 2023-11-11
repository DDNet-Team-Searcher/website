import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'net';
import { Action, Request } from 'src/protos/request';
import { Response, ResponseCode } from 'src/protos/response';

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

    async onModuleInit(): Promise<void> {
        const servers = await this.getAllServers();

        for (let i = 0; i < servers.length; i++) {
            const { ip, port, id } = servers[i];
            const socket = new Socket();

            await new Promise<void>((res) => {
                socket.connect(port, ip, async () => {
                    //TODO: fix this bs
                    console.log(
                        `TCP connection established with ${ip}:${port}`,
                    );

                    const server = {
                        socket,
                        max: 0,
                        used: 0,
                    };

                    this.sockets.set(id, server);

                    const { used, max } = await this.getServerDataAboutHowManyServersItCanRunButThisMethodNameSeemsBigIllLeaveItLikeThis(id);

                    server.used = used;
                    server.max = max;

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
                    let respose = Response.decode(bytes);
                    //TODO: idk how but here should be handled responses from the rust server which will be triggered by ddnet server
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

            const request = Request.create({
                action: Action.INFO
            });

            socket.write(Request.encode(request).finish());

            const handler = (bytes: Buffer) => {
                //FIXME: error handling left the code
                const response = Response.decode(bytes);

                if (typeof response.max !== "number" || typeof response.used !== "number") {
                    console.log("This bs doesnt work D:", response);
                }

                if (response.responseCode == ResponseCode.OK) {
                    res({
                        used: response.used!,
                        max: response.max!,
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
            const socket = this.sockets.get(serverId)?.socket!;

            const request = Request.create({
                action: Action.START,
                mapName: data.mapName,
                id: data.id
            });

            socket.write(Request.encode(request).finish());

            const handler = (bytes: Buffer) => {
                //FIXME: error handling left the code
                const response = Response.decode(bytes);

                if (!response.port || !response.password) {
                    console.log("Thats.. not good #69");
                }

                if (response.responseCode == ResponseCode.OK) {
                    res({
                        port: response.port!,
                        password: response.password!
                    });
                } else {
                    console.log("Couldnt start the game server");
                }

                socket.removeListener('data', handler);
            };

            socket.on('data', handler);
        });
    }

    shutdownServer(serverId: number, happeningId: number): Promise<void> {
        return new Promise<void>((res) => {
            const socket = this.sockets.get(serverId)?.socket!;

            const request = Request.create({
                action: Action.SHUTDOWN,
                id: happeningId
            });

            socket.write(Request.encode(request).finish());

            const handler = (bytes: Buffer) => {
                //FIXME: error handling left the code
                const response = Response.decode(bytes);

                if (response.responseCode == ResponseCode.OK) {
                    res();
                } else {
                    console.log("Couldnt shutdown the server owo");
                }

                socket.removeListener('data', handler);
            };

            socket.on('data', handler);
        });
    }
}
