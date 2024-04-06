import { ServerInfo } from '@app/shared/types/Server.type';
import { JwtService } from '@nestjs/jwt';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Server } from 'socket.io';
import { Protected } from 'src/decorators/protected.decorator';
import { WSAuthMiddleware } from 'src/middlewares/ws-auth.middleware';
import { ServersService } from 'src/servers/servers.service';
import { AuthSocket } from 'src/types/AuthSocket.type';

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
})
@Protected()
export class WebsocketsGateway implements NestGateway {
    @WebSocketServer()
    server: Server;
    users: Map<number, string> = new Map();

    constructor(
        private readonly jwtService: JwtService,
        private readonly serversService: ServersService,
    ) {}

    afterInit(server: Server): void {
        const middleware = WSAuthMiddleware(this.jwtService);
        server.use(middleware);
    }

    handleConnection(client: AuthSocket): void {
        this.users.set(client.user.id, client.id);
    }

    handleDisconnect(client: AuthSocket): void {
        this.users.delete(client.user.id);
    }

    @SubscribeMessage('stats')
    async stats(@MessageBody() body: string): Promise<WsResponse<ServerInfo>> {
        return {
            event: 'stats',
            data: await this.serversService.stats(parseInt(body)),
        };
    }

    sendNotification(userId: number, notification: object): void {
        if (this.users.has(userId)) {
            this.server
                .to(this.users.get(userId)!)
                .emit('notification', notification);
        }
    }
}
