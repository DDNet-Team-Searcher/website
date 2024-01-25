import { Role } from '@app/shared/types/Role.type';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

function rolePrecedence(role: keyof typeof Role | null): number {
    switch (role) {
        case Role.Admin:
            return 3;
        case Role.Mod:
            return 2;
        case Role.Verified:
            return 1;
        default:
            return 0;
    }
}

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const role = this.reflector.get<Role>(
            'permission',
            context.getHandler(),
        );

        if (role !== undefined) {
            try {
                const req = context.switchToHttp().getRequest();
                const userRole = await this.usersService.role(req.user.id);

                if (rolePrecedence(userRole) >= rolePrecedence(role)) {
                    throw new ForbiddenException();
                }

                return true;
            } catch (e) {
                if (!(e instanceof HttpException)) {
                    throw new InternalServerErrorException();
                }

                throw e;
            }
        }
        return true;
    }
}
