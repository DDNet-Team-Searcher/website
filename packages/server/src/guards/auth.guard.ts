import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const isProtected = this.reflector.get(
            'protected',
            context.getHandler(),
        );

        if (isProtected !== undefined) {
            const request = context.switchToHttp().getRequest();

            try {
                const data: { id: number } = this.jwtService.verify(
                    request.cookies['token'],
                );
                request.user = data;
            } catch (e) {
                throw new ForbiddenException();
            }
        }
        return true;
    }
}
