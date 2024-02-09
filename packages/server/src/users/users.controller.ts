import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpException,
    InternalServerErrorException,
    Logger,
    NotFoundException,
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
import { MailerService } from '@nestjs-modules/mailer';
import { AuthedRequest } from 'src/types/AuthedRequest.type';
import {
    BanUserResponse,
    FollowUserResponse,
    GetProfileHappenings,
    GetProfileResponse,
    GetProfileReviews,
    GetUserCredentialsResponse,
    LoginUserResponse,
    LogoutUserResponse,
    RegisterUserResponse,
    ReportUserResponse,
    UnbanUserResponse,
    UpdateAvatarResponse,
    UpdateEmailRespone as UpdateEmailResponse,
    UpdatePasswordResponse,
    UpdateUsernameResponse,
} from '@app/shared/types/api.type';
import { log } from 'src/decorators/log.decorator';
import { HappeningType } from '@prisma/client';

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly logger: Logger,
    ) {}

    @Post('/register')
    @log('register a user')
    async register(
        @Body() data: RegisterUserDTO,
        @I18n() i18n: I18nContext,
    ): Promise<RegisterUserResponse> {
        const doesUserAlreadyExist = await this.usersService.isUserExists({
            where: {
                email: data.email,
            },
        });

        if (doesUserAlreadyExist) {
            throw new BadRequestException({
                status: 'fail',
                data: null,
                message: i18n.t('user.already_exists'),
            });
        }

        try {
            const encryptedPassword = await argon2.hash(data.password);

            const activationCode = await this.usersService.register({
                ...data,
                password: encryptedPassword,
            });

            await this.mailerService.sendMail({
                to: data.email,
                from: '"No Reply" <noreply@ddts.com>',
                subject: 'Registration on ddts',
                template: 'registration_confirmation',
                context: {
                    username: data.username,
                    link: `${process.env.BASE_URL}/api/activate-account/${activationCode}`,
                },
            });

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            this.logger.error(new Error('failed to register a user'));
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Something bad happened on server xD',
            });
        }
    }

    @Get('/activate-account/:code')
    @log('active user account')
    async activateAccount(
        @Res() res: Response,
        @Param('code') code: string,
    ): Promise<void> {
        const result = await this.usersService.activateAccount(code);

        //TODO: do smth with these hardcoded urls
        if (result) {
            res.redirect('http://localhost:3000/login');
        } else {
            res.redirect('http://localhost:3000/login');
        }
    }

    @Post('/login')
    async login(
        @Body() data: LoginUserDTO,
        @Res({ passthrough: true }) res: Response,
        @I18n() i18n: I18nContext,
    ): Promise<LoginUserResponse> {
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

        if (!user.activated) {
            throw new ForbiddenException({
                status: 'fail',
                message: i18n.t('user.account_not_activated'),
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
    async logout(
        @Res({ passthrough: true }) res: Response,
    ): Promise<LogoutUserResponse> {
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
    @log("update user's avatar")
    async updateAvatar(
        @UploadedFile() avatar: Express.Multer.File,
        @Req() req: AuthedRequest,
    ): Promise<UpdateAvatarResponse> {
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
            this.logger.error(new Error("failed to update user's avatar"));
            throw new InternalServerErrorException();
        }
    }

    @Innocent()
    @Protected()
    @Post('/profile/username')
    @log("update user's username")
    async updateUsername(
        @Req() req: AuthedRequest,
        @Body() data: ChangeUsernameDTO,
        @I18n() i18n: I18nContext,
    ): Promise<UpdateUsernameResponse> {
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
                this.logger.error(
                    new Error("failed to update user's username"),
                );
                throw new InternalServerErrorException();
            }
        }
    }

    @Innocent()
    @Protected()
    @Post('/profile/email')
    @log("update user's email")
    async updateEmail(
        @Req() req: AuthedRequest,
        @Body() data: ChangeEmailDTO,
        @I18n() i18n: I18nContext,
    ): Promise<UpdateEmailResponse> {
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
                this.logger.error(new Error("failed to update user's email"));
                throw new InternalServerErrorException();
            }
        }
    }

    @Innocent()
    @Protected()
    @Post('/profile/password')
    @log("update user's password")
    async updatePassword(
        @Req() req: AuthedRequest,
        @Body() data: ChangePasswordDTO,
        @I18n() i18n: I18nContext,
    ): Promise<UpdatePasswordResponse> {
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
                this.logger.error(
                    new Error("failed to update user's password"),
                );
                throw new InternalServerErrorException();
            }
        }
    }

    @Protected()
    @Get('/credentials')
    async getAuthedUserData(
        @Req() req: Request & { user: { id: number } },
    ): Promise<GetUserCredentialsResponse> {
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
    async getUserProfile(
        @Param('id') id: string,
        @Req() req: AuthedRequest,
    ): Promise<GetProfileResponse> {
        const ID = parseInt(id);

        if (!ID) {
            throw new BadRequestException();
        }

        const profile = await this.usersService.getUserProfile(req.user.id, ID);

        if (profile) {
            return {
                status: 'success',
                data: {
                    profile,
                },
            };
        }

        throw new NotFoundException();
    }

    @Protected()
    @Get('/profile/:id/happenings')
    async userHappenings(
        @Param('id') id: string,
        @Req() req: AuthedRequest,
    ): Promise<GetProfileHappenings> {
        const happenings = await this.usersService.happenings(
            req.user.id,
            parseInt(id),
            {
                type: HappeningType.Run,
            },
        );

        return {
            status: 'success',
            data: {
                happenings,
            },
        };
    }

    @Protected()
    @Get('/profile/:id/reviews')
    async userReviews(@Param('id') id: string): Promise<GetProfileReviews> {
        const reviews = await this.usersService.reviews(parseInt(id));

        return {
            status: 'success',
            data: {
                reviews: reviews,
            },
        };
    }

    @Innocent()
    @Protected()
    @Put('/user/:id/follow')
    async follow(
        @Param('id') id: string,
        @Req() req: AuthedRequest,
    ): Promise<FollowUserResponse> {
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
        @Req() req: AuthedRequest,
        @Body() body,
        @I18n() i18n: I18nContext,
    ): Promise<ReportUserResponse> {
        const isAlreadyReported = await this.usersService.isReported(
            parseInt(id),
            req.user.id,
        );

        if (isAlreadyReported) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.already_reported'),
            });
        }

        await this.usersService.report(parseInt(id), req.user.id, body.reason);

        return {
            status: 'success',
            data: null,
            message: i18n.t('user.reported_successfully'),
        };
    }

    @Protected()
    @Post('/user/:id/ban')
    async ban(
        @Param('id') id: string,
        @Req() req: AuthedRequest,
        @Body() body,
        @I18n() i18n: I18nContext,
    ): Promise<BanUserResponse> {
        const isBanned = await this.usersService.isBanned(parseInt(id));

        if (isBanned) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.already_banned'),
            });
        }

        await this.usersService.ban(parseInt(id), req.user.id, body.reason);

        return {
            status: 'success',
            data: null,
            message: i18n.t('user.banned_successfully'),
        };
    }

    @Protected()
    @Post('/user/:id/unban')
    async unban(
        @Param('id') id: string,
        @I18n() i18n: I18nContext,
    ): Promise<UnbanUserResponse> {
        const isBanned = await this.usersService.isBanned(parseInt(id));

        if (!isBanned) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.cant_unban_not_banned'),
            });
        }

        await this.usersService.unban(parseInt(id));

        return {
            status: 'success',
            data: null,
            message: i18n.t('user.unbanned_successfully'),
        };
    }
}
