import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { objToInt } from "src/utils/permissions.util";

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
}
