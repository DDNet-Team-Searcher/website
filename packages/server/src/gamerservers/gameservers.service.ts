import { Injectable, OnModuleInit } from '@nestjs/common';
import { Socket } from 'net';
import { ServersService } from 'src/servers/servers.service';

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

@Injectable()
export class GameServersService implements OnModuleInit {
    sockets: Map<number, Socket> = new Map();

    constructor(
        private readonly serversService: ServersService,
    ) { }

    async onModuleInit() {
        //FIXME: when server in db doesnt work, it still would try to connecto to it, so proly have to move findEmptyServer in this service
        //there're so many fixmes but whos gonna fix em all? 😔
        const servers = await this.serversService.getAllServers();

        for (let i = 0; i < servers.length; i++) {
            const { ip, port, id } = servers[i];
            const socket = new Socket();

            await new Promise<void>((res, rej) => {
                socket.connect(port, ip, () => {
                    this.sockets.set(servers[i].id, socket);
                    res();
                    console.log(
                        `TCP connection established with ${ip}:${port}`,
                    );
                });

                socket.on('error', (err) => {
                    console.log(
                        `Uh oh, we are fucked lmao. Couldnt connect to ${ip}:${port}`,
                    );
                    console.log(err);

                    this.sockets.delete(id);
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

    async startServer(
        serverId: number,
        data: { mapName: string; id: number },
    ): Promise<{ port: number; password: string }> {
        return new Promise((res) => {
            const socket = this.sockets.get(serverId);

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
            const socket = this.sockets.get(serverId);

            socket.write(
                Buffer.from(
                    JSON.stringify({ action: 'SHUTDOWN', id: happeningId }) + "\n"
                ),
            );


            const handler = (bytes: Buffer) => {
                const { status } = JSON.parse(bytes.toString());
                console.log(status);

                if (status == "SERVER_SHUTDOWN_SUCCESSFULLY") {
                    res();
                }

                socket.removeListener('data', handler);
            };

            socket.on('data', handler);
        });
    }
}
