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
    Ip,
    Logger,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
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
    BannedUsersResponse,
    FollowUserResponse,
    GetProfileHappenings,
    GetProfileResponse,
    GetProfileReviews,
    GetUserCredentialsResponse,
    LoginUserResponse,
    LogoutUserResponse,
    RegisterUserResponse,
    ReportUserResponse,
    ReportsRespone,
    UnbanUserResponse,
    UpdateAvatarResponse,
    UpdateEmailRespone as UpdateEmailResponse,
    UpdatePasswordResponse,
    UpdateUsernameResponse,
} from '@app/shared/types/api.type';
import { log } from 'src/decorators/log.decorator';
import { HappeningType, Role, Status } from '@prisma/client';
import { ReportsService } from 'src/reports/reports.service';
import { Permission } from 'src/decorators/permission.decorator';
import { Role as RoleT } from '@app/shared/types/Role.type';
import { ReviewsService } from 'src/reviews/reviews.service';
import { HappeningsService } from 'src/happenings/happenings.service';
import { CreateReportDTO } from './dto/create-report.dto';
import { BanDTO } from './dto/ban.dto';

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly reportsService: ReportsService,
        private readonly reviewsService: ReviewsService,
        private readonly happeningsService: HappeningsService,
        private readonly logger: Logger,
    ) {}

    @Post('/register')
    @log('register a user')
    async register(
        @Body() data: RegisterUserDTO,
        @Ip() ip: string,
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

        if (await this.usersService.isIpBanned(ip)) {
            throw new ForbiddenException({
                status: 'fail',
                data: null,
                message: 'You cannot create an account. Your IP is banned',
            });
        }

        try {
            const encryptedPassword = await argon2.hash(data.password);

            const activationCode = await this.usersService.register({
                ...data,
                password: encryptedPassword,
                ip,
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

    @Protected()
    @Innocent()
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

    @Protected()
    @Innocent()
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

    @Protected()
    @Innocent()
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

    @Protected()
    @Innocent()
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
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthedRequest,
    ): Promise<GetProfileResponse> {
        const profile = await this.usersService.getUserProfile(req.user.id, id);

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
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthedRequest,
        @Query('query') query: string | undefined,
        @Query('status') status: string | undefined,
        @Query('type') type: string | undefined,
    ): Promise<GetProfileHappenings> {
        const opts: {
            type?: HappeningType;
            status?: Status;
            query?: string;
        } = {};

        if (query !== undefined) {
            opts.query = query;
        }

        if (
            status !== undefined &&
            Object.values(Status as Record<string, string>).includes(status)
        ) {
            opts.status = status as Status;
        }

        if (
            type !== undefined &&
            Object.values(HappeningType as Record<string, string>).includes(
                type,
            )
        ) {
            opts.type = type as HappeningType;
        }

        const happenings = await this.happeningsService.findUserHappenings(
            req.user.id,
            id,
            opts,
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
    async userReviews(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<GetProfileReviews> {
        const reviews = await this.reviewsService.reviewsAboutUser(id);

        return {
            status: 'success',
            data: {
                reviews: reviews,
            },
        };
    }

    @Protected()
    @Innocent()
    @Put('/user/:id/follow')
    async follow(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthedRequest,
    ): Promise<FollowUserResponse> {
        await this.usersService.follow(req.user.id, id);

        return {
            status: 'success',
            data: null,
        };
    }

    @Protected()
    @Innocent()
    @Post('/user/:id/report')
    async report(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthedRequest,
        @Body() body: CreateReportDTO,
        @I18n() i18n: I18nContext,
    ): Promise<ReportUserResponse> {
        const isAlreadyReported = await this.reportsService.isReported(
            id,
            req.user.id,
        );

        if (isAlreadyReported) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.already_reported'),
            });
        }

        await this.reportsService.report(id, req.user.id, body.reason);

        return {
            status: 'success',
            data: null,
            message: i18n.t('user.reported_successfully'),
        };
    }

    @Protected()
    @Permission(Role.Mod as RoleT.Mod)
    @Post('/user/:id/ban')
    async ban(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthedRequest,
        @Body() body: BanDTO,
        @I18n() i18n: I18nContext,
    ): Promise<BanUserResponse> {
        const isBanned = await this.usersService.isBanned(id);

        if (isBanned) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.already_banned'),
            });
        }

        await this.usersService.ban(id, req.user.id, body.reason);

        return {
            status: 'success',
            data: null,
            message: i18n.t('user.banned_successfully'),
        };
    }

    @Protected()
    @Permission(Role.Mod as RoleT.Mod)
    @Post('/user/:id/unban')
    async unban(
        @Param('id', ParseIntPipe) id: number,
        @I18n() i18n: I18nContext,
    ): Promise<UnbanUserResponse> {
        const isBanned = await this.usersService.isBanned(id);

        if (!isBanned) {
            throw new ConflictException({
                status: 'fail',
                data: null,
                message: i18n.t('user.cant_unban_not_banned'),
            });
        }

        await this.usersService.unban(id);

        return {
            status: 'success',
            data: null,
            message: i18n.t('user.unbanned_successfully'),
        };
    }

    @Protected()
    @Permission(Role.Mod as RoleT.Mod)
    @Get('/users/banned')
    async bannedUsers(
        @Query('query') query?: string,
    ): Promise<BannedUsersResponse> {
        const data = await this.usersService.bannedUsers(query);

        return {
            status: 'success',
            data,
        };
    }

    @Protected()
    @Permission(Role.Mod as RoleT.Mod)
    @Get('/reports')
    async reports(@Query('query') query?: string): Promise<ReportsRespone> {
        const data = await this.reportsService.reports(query);

        return {
            status: 'success',
            data,
        };
    }
}
