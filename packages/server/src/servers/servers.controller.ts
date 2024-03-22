import {
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { AddressInfo } from 'net';
import { Server } from '@app/shared/types/Server.type';
import { ServerResponse, ServersResponse } from '@app/shared/types/api.type';
import { Permission } from 'src/decorators/permission.decorator';
import { Protected } from 'src/decorators/protected.decorator';
import { Role } from '@prisma/client';
import { Role as RoleT } from '@app/shared/types/Role.type';

@Controller('/servers')
export class ServersController {
    constructor(private readonly serversService: ServersService) {}

    @Protected()
    @Permission(Role.Admin as RoleT)
    @Get('/')
    async getServers(): Promise<ServersResponse> {
        const servers: Server[] = [];

        for (const [id, server] of this.serversService.sockets) {
            const ip = (server.socket.address() as AddressInfo).address;

            servers.push({ id, online: true, ip });
        }

        for (const [id, server] of this.serversService.failed) {
            servers.push({ id, online: false, ip: server.ip });
        }

        servers.sort((a, b) => a.id - b.id);

        return {
            status: 'success',
            data: servers,
        };
    }

    @Protected()
    @Permission(Role.Admin as RoleT)
    @Get('/:id')
    async serverInfo(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ServerResponse> {
        const server = this.serversService.getServer(id);

        if (!server) {
            throw new NotFoundException({
                status: 'fail',
                data: null,
                message: 'Server not found',
            });
        }

        return {
            status: 'success',
            data: server,
        };
    }
}
