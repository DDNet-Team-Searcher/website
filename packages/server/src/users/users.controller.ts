import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Req,
    Res,
    SetMetadata,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UsersService } from './users.service';
import * as argon2 from 'argon2';
import { Request, Response } from 'express';

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    @Post('/register')
    async register(@Body() data: RegisterUserDTO) {
        const isUserAlreayExists = await this.usersService.isUserExists({
            where: {
                email: data.email,
            },
        });

        if (isUserAlreayExists) {
            throw new BadRequestException({
                status: 'fail',
                data: null,
                message: 'User with such an email already exists',
            });
        }

        try {
            const encryptedPassword = await argon2.hash(data.password);
            await this.usersService.register({
                ...data,
                password: encryptedPassword,
            });

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Something bad happened on server xD',
            });
        }
    }

    @Post('/login')
    async login(
        @Body() data: LoginUserDTO,
        @Res({ passthrough: true }) res: Response,
    ) {
        const isUserExists = await this.usersService.isUserExists({
            where: {
                email: data.email,
            },
        });

        if (!isUserExists) {
            throw new BadRequestException({
                status: 'fail',
                message: 'Email or password is wrong',
            });
        }

        const { password, ...user } = await this.usersService.getUserByEmail(
            data.email,
        );

        if (!(await argon2.verify(password, data.password))) {
            throw new BadRequestException({
                status: 'fail',
                message: 'Email or password is wrong',
            });
        }

        res.cookie(
            'token',
            this.jwtService.sign({ id: user.id }, { expiresIn: '10d' }),
        );

        return {
            status: 'success',
            data: null,
        };
    }

    @SetMetadata('protected', true)
    @Get('/credentials')
    async getAuthedUserData(@Req() req: Request & { user: { id: number } }) {
        const { password, ...user } = await this.usersService.getUserById(
            req.user.id,
        );

        return {
            status: 'success',
            data: user,
        };
    }

    @Get('/profile/:id')
    async getUserProfile(@Param('id') id: string) {
        const profile = await this.usersService.getUserProfile(parseInt(id));

        return {
            status: 'success',
            data: {
                profile
            }
        };
    }
}
