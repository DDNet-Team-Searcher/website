import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Protected } from 'src/decorators/protected.decorator';
import { Permission } from 'src/decorators/permission.decorator';
import { PermissionGuard } from 'src/guards/permission.guard';
import { UpdateRoleDTO } from './dto/UpdateRole.dto';
import { CreateRoleDTO } from './dto/CreateRole.dto';
import { CAN_MANAGE_ROLES } from '.';
import { log } from 'src/decorators/log.decorator';

@UseGuards(PermissionGuard)
@Controller('roles')
export class RolesController {
    constructor(
        private readonly logger: Logger,
        private readonly rolesService: RolesService,
    ) { }

    @Protected()
    @Permission(CAN_MANAGE_ROLES)
    @Get()
    async allRoles() {
        return await this.rolesService.roles();
    }

    @Protected()
    @Permission(CAN_MANAGE_ROLES)
    @log('create a new role')
    async createRole(@Body() data: CreateRoleDTO) {
        try {
            const role = await this.rolesService.createRole(data);

            return {
                status: 'succes',
                data: {
                    role,
                },
            };
        } catch (e) {
            this.logger.error(new Error('failed to create a new role'));
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Permission(CAN_MANAGE_ROLES)
    @Put(':id')
    @log('update a role')
    async updateRole(@Param('id') id: string, @Body() data: UpdateRoleDTO) {
        try {
            await this.rolesService.updateRole(parseInt(id), data);

            return {
                status: 'succes',
                data: null,
            };
        } catch (e) {
            this.logger.error(new Error('failed to update a role'));
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Permission(CAN_MANAGE_ROLES)
    @Put(':id')
    @log('delete a role')
    async deleteRole(@Param('id') id: string) {
        try {
            await this.rolesService.deleteRole(parseInt(id));

            return {
                status: 'succes',
                data: null,
            };
        } catch (e) {
            this.logger.error(new Error('failed to delete a role'));
            throw new InternalServerErrorException();
        }
    }
}
