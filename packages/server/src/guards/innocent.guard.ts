import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InnocentGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const innocent = this.reflector.get('innocent', context.getHandler());

        if (innocent !== undefined) {
            const request = context.switchToHttp().getRequest();

            try {
                const isBanned = await this.prismaService.ban.findFirst({
                    where: {
                        userId: request.user.id,
                        banned: true,
                    },
                });

                if (isBanned !== null) {
                    //throwing error to catch it and throw another one xd
                    throw new Error();
                }
            } catch (e) {
                throw new ForbiddenException({
                    status: 'fail',
                    data: null,
                    message: "Blocked mfs aren't allowed to request this data",
                });
            }
        }

        return true;
    }
}
