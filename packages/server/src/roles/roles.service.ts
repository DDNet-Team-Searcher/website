import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { objToInt } from "src/utils/permissions.util";
import { UpdateRoleDTO } from "./dto/UpdateRole.dto";
import { CreateRoleDTO } from "./dto/CreateRole.dto";

@Injectable()
export class RolesService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async userPermissions(userId: number): Promise<number> {
        let res = 0;

        // holy fuck its ugly
        const roles = await this.prismaService.user.findMany({
            where: {
                id: userId
            },
            select: {
                roles: {
                    select: {
                        role: {
                            select: {
                                canBan: true,
                                canManagePosts: true,
                                canManageRoles: true,
                                canDeleteHappenings: true
                            }
                        }
                    }
                }
            }
        });

        for (const role of roles[0].roles) {
            res |= objToInt(role.role);
        }

        return res;
    }

    async roles(): Promise<Role[]> {
        return await this.prismaService.role.findMany();
    }

    async createRole(data: CreateRoleDTO): Promise<Role> {
        return await this.prismaService.role.create({
            data
        });
    }

    async updateRole(id: number, data: UpdateRoleDTO): Promise<void> {
        await this.prismaService.role.update({
            where: {
                id
            },
            data
        });
    }

    async deleteRole(id: number): Promise<void> {
        await this.prismaService.role.delete({
            where: {
                id
            }
        });
    }
}
