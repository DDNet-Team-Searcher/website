import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    HttpException,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UsersService } from './users.service';
import * as argon2 from 'argon2';
import { Request, Response } from 'express';
import { Protected } from 'src/decorators/protected.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangeUsernameDTO } from './dto/change-username.dto';
import { ChangeEmailDTO } from './dto/change-email.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { getAvatarUrl } from 'src/utils/user.util';
import { Innocent } from 'src/decorators/innocent.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    @Post('/register')
    async register(@Body() data: RegisterUserDTO, @I18n() i18n: I18nContext) {
        const isUserAlreayExists = await this.usersService.isUserExists({
            where: {
                email: data.email,
            },
        });

        if (isUserAlreayExists) {
            throw new BadRequestException({
                status: 'fail',
                data: null,
                message: i18n.t('user.already_exists')
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
        @I18n() i18n: I18nContext
    ) {
        const isUserExists = await this.usersService.isUserExists({
            where: {
                email: data.email,
            },
        });

        if (!isUserExists) {
            throw new BadRequestException({
                status: 'fail',
                message: i18n.t('user.wrong_credentials'),
            });
        }

        const { password, ...user } = (await this.usersService.getUserByEmail(
            data.email,
        ))!; //NOTE: this is fine

        if (!(await argon2.verify(password, data.password))) {
            throw new BadRequestException({
                status: 'fail',
                message: i18n.t('user.wrong_credentials'),
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

    @Protected()
    @Delete('/logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token');

        return {
            status: 'success',
            data: null,
        };
    }

    @Innocent()
    @Protected()
    @Post('/profile/avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateAvatar(
        @UploadedFile() avatar: Express.Multer.File,
        @Req() req,
    ) {
        try {
            const filename = await this.usersService.updateAvatar(
                req.user.id,
                avatar,
            );

            return {
                status: 'success',
                data: {
                    avatar: getAvatarUrl(filename),
                },
            };
        } catch (e) {
            console.log(e);
        }
    }

    @Innocent()
    @Protected()
    @Post('/profile/username')
    async updateUsername(@Req() req, @Body() data: ChangeUsernameDTO, @I18n() i18n: I18nContext) {
        try {
            const isSuccess = await this.usersService.updateUsername(
                req.user.id,
                data,
            );

            if (isSuccess) {
                return {
                    status: 'success',
                    data: null,
                };
            } else {
                throw new BadRequestException({
                    status: 'fail',
                    data: { password: i18n.t('user.different_passwords') },
                });
            }
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    @Innocent()
    @Protected()
    @Post('/profile/email')
    async updateEmail(@Req() req, @Body() data: ChangeEmailDTO, @I18n() i18n: I18nContext) {
        try {
            const isSuccess = await this.usersService.updateEmail(
                req.user.id,
                data,
            );

            if (isSuccess) {
                return {
                    status: 'success',
                    data: null,
                };
            } else {
                throw new BadRequestException({
                    status: 'fail',
                    data: { password: i18n.t('user.different_passwords') },
                });
            }
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    @Innocent()
    @Protected()
    @Post('/profile/password')
    async updatePassword(@Req() req, @Body() data: ChangePasswordDTO, @I18n() i18n: I18nContext) {
        try {
            const isSuccess = await this.usersService.updatePassword(
                req.user.id,
                data,
            );

            if (isSuccess) {
                return {
                    status: 'success',
                    data: null,
                };
            } else {
                throw new BadRequestException({
                    status: 'fail',
                    data: { old: i18n.t('user.different_passwords') },
                });
            }
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    @Protected()
    @Get('/credentials')
    async getAuthedUserData(@Req() req: Request & { user: { id: number } }) {
        const credentials = await this.usersService.getUserCredentials(
            req.user.id,
        );

        return {
            status: 'success',
            data: {
                user: credentials,
            },
        };
    }

    @Protected()
    @Get('/profile/:id')
    async getUserProfile(@Param('id') id: string, @Req() req) {
        const profile = await this.usersService.getUserProfile(
            req.user.id,
            parseInt(id),
        );

        if (profile) {
            return {
                status: 'success',
                data: {
                    profile,
                },
            };
        }
    }

    @Innocent()
    @Protected()
    @Put('/user/:id/follow')
    async follow(@Param('id') id: string, @Req() req) {
        await this.usersService.follow(req.user.id, parseInt(id));

        return {
            status: 'success',
            data: null,
        };
    }

    //TODO: do something with types :clueless:
    @Innocent()
    @Protected()
    @Post('/user/:id/report')
    async report(
        @Param('id') id: string,
        @Req() req,
        @Body() body,
        @I18n() i18n: I18nContext
    ) {
        const isAlreadyReported = await this.usersService.isReported(parseInt(id), req.user.id);

        if (isAlreadyReported) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.already_reported')
            });
        }

        await this.usersService.report(parseInt(id), req.user.id, body.reason);

        return {
            status: 'success',
            data: null,
            message: i18n.t('user.reported_successfully')
        };
    }

    @Protected()
    @Post('/user/:id/ban')
    async ban(
        @Param('id') id: string,
        @Req() req,
        @Body() body,
        @I18n() i18n: I18nContext
    ) {
        const isBanned = await this.usersService.isBanned(parseInt(id));

        if (isBanned) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.already_banned')
            });
        }

        await this.usersService.ban(parseInt(id), req.user.id, body.reason);


        return {
            status: 'success',
            data: null,
            message: i18n.t('user.banned_successfully')
        };
    }

    @Protected()
    @Post('/user/:id/unban')
    async unban(@Param('id') id: string, @I18n() i18n: I18nContext) {
        const isBanned = await this.usersService.isBanned(parseInt(id));

        if (!isBanned) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.cant_unban_not_banned')
            });
        }

        await this.usersService.unban(parseInt(id));

        return {
            status: 'success',
            data: null,
            message: i18n.t('user.unbanned_successfully')
        };
    }
}
