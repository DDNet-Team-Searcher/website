import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const author = this.reflector.get<'happening' | 'review' | undefined>(
            'author',
            context.getHandler(),
        );

        if (author) {
            try {
                const req = context.switchToHttp().getRequest();

                const id = parseInt(req.params.id);

                //TODO: fix my 1000iq use of ANY
                const something = await this.prismaService[author as any].findFirst(
                    {
                        where: {
                            id,
                        },
                        select: {
                            authorId: true,
                        },
                    },
                );

                if (!something) {
                    throw new NotFoundException();
                }
                if (something.authorId !== req.user.id) {
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
