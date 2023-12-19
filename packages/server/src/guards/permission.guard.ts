import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly rolesService: RolesService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissionMask = this.reflector.get<number>(
            'permission',
            context.getHandler(),
        );

        if (permissionMask !== undefined) {
            try {
                const req = context.switchToHttp().getRequest();

                let perms = await this.rolesService.userPermissions(req.user.id);
                console.log(perms.toString(2), permissionMask.toString(2));
                if (!((perms & permissionMask) == permissionMask)) {
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
