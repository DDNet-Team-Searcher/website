import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
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

@UseGuards(PermissionGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Protected()
    @Permission(CAN_MANAGE_ROLES)
    @Get()
    async allRoles() {
        return await this.rolesService.roles();
    }

    @Protected()
    @Permission(CAN_MANAGE_ROLES)
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
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Permission(CAN_MANAGE_ROLES)
    @Put(':id')
    async updateRole(@Param('id') id: string, @Body() data: UpdateRoleDTO) {
        try {
            await this.rolesService.updateRole(parseInt(id), data);

            return {
                status: 'succes',
                data: null,
            };
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Permission(CAN_MANAGE_ROLES)
    @Put(':id')
    async deleteRole(@Param('id') id: string) {
        try {
            await this.rolesService.deleteRole(parseInt(id));

            return {
                status: 'succes',
                data: null,
            };
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}
