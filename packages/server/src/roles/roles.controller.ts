import { Controller, Get, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { PermissionGuard } from "src/guards/permission.guard";

@UseGuards(PermissionGuard)
@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService
    ) { }
}
