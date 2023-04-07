import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private prismaService: PrismaService,
    ) {}

    async isUserExists(
        args: Parameters<UsersService['prismaService']['user']['count']>[0],
    ): Promise<Boolean> {
        return this.prismaService.exists(this.prismaService.user, args);
    }

    async getUserByEmail(email: string) {
        return this.prismaService.user.findFirst({
            where: {
                email,
            },
        });
    }

    async getUserById(id: number) {
        return this.prismaService.user.findFirst({
            where: {
                id,
            },
        });
    }

    async register(data: RegisterUserDTO) {
        return await this.prismaService.user.create({
            data,
        });
    }
}
