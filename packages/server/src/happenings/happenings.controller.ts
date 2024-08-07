import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    InternalServerErrorException,
    Logger,
    NotAcceptableException,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventDTO } from './dto/event.dto';
import { RunDTO } from './dto/run.dto';
import { HappeningsService } from './happenings.service';
import { Protected } from 'src/decorators/protected.decorator';
import { AuthorGuard } from 'src/guards/author.guard';
import { Author } from 'src/decorators/author.decorator';
import { Happening } from '@app/shared/types/Happening.type';
import { HappeningType } from '@prisma/client';
import { Validator } from 'class-validator';
import { InnocentGuard } from 'src/guards/innocent.guard';
import { Innocent } from 'src/decorators/innocent.decorator';
import { AllServersInUseError } from './happenings.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthedRequest } from 'src/types/AuthedRequest.type';
import {
    CreateEventResponse,
    CreateRunResponse,
    DeleteHappeningResponse,
    EndHappeningResponse,
    GetHappeningResponse,
    GetHappeningsResponse,
    GetInterestedUsersResponse,
    SetIsInterestedInHappeningResponse,
    StartHappeningResponse,
    UpdateHappeningResponse,
    UpdateIsPlayerInTeamResponse,
} from '@app/shared/types/api.type';
import { log } from 'src/decorators/log.decorator';

@UseGuards(AuthorGuard)
@UseGuards(InnocentGuard)
@Controller()
export class HappeningsController {
    constructor(
        private readonly happeningsService: HappeningsService,
        private readonly logger: Logger,
    ) {}

    @Protected()
    @Innocent()
    @Post('/create/run')
    @log('create a new run')
    async createRun(
        @Req() req: AuthedRequest,
        @Body() data: RunDTO,
    ): Promise<CreateRunResponse> {
        try {
            const { id } = await this.happeningsService.createRun({
                ...data,
                authorId: req.user.id,
            });

            const run = await this.happeningsService.getRunById(
                id,
                req.user.id,
            );

            return {
                status: 'success',
                data: run,
            };
        } catch (e) {
            this.logger.error(new Error('failed to create a new run'));
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Innocent()
    @Post('/create/event')
    @UseInterceptors(FileInterceptor('thumbnail'))
    @log('create a new event')
    async createEvent(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: AuthedRequest,
        @Body() data: EventDTO,
    ): Promise<CreateEventResponse> {
        try {
            const { id } = await this.happeningsService.createEvent({
                ...data,
                thumbnail: file,
                authorId: req.user.id,
            });

            const event = await this.happeningsService.getEventById(
                id,
                req.user.id,
            );

            return {
                status: 'success',
                data: event,
            };
        } catch (e) {
            this.logger.error(new Error('failed to create a new event'));
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Innocent()
    @Author('happening')
    @Put('/:id/update')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async updateHappening(
        @UploadedFile() file: Express.Multer.File,
        @Body() body,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UpdateHappeningResponse> {
        const happeningType = await this.happeningsService.getHappeningType(id);

        if (happeningType == HappeningType.Run) {
            const run = new RunDTO();

            run.mapName = body.mapName;
            run.teamSize = body.teamSize
                ? parseInt(body.teamSize)
                : body.teamSize;
            run.startAt = body.startAt;
            run.description = body.description;
            run.place = body.place ? parseInt(body.place) : body.place;

            const errors = await new Validator().validate(run);
            const obj: Record<string, string> = {};

            if (errors.length) {
                for (const err of errors) {
                    obj[err.property] = Object.values(err.constraints!)[0];
                }

                throw new BadRequestException({
                    status: 'fail',
                    data: obj,
                });
            }

            await this.happeningsService.updateRun(id, run);
        } else if (happeningType == HappeningType.Event) {
            const event = new EventDTO();

            event.title = body.title;
            event.mapName = body.mapName;
            event.startAt = body.startAt;
            event.description = body.description;
            event.place = body.place;

            if (body.endAt) {
                event.endAt = body.endAt;
            }

            const errors = await new Validator().validate(event);
            const obj: Record<string, string> = {};

            if (errors.length) {
                for (const err of errors) {
                    obj[err.property] = Object.values(err.constraints!)[0];
                }

                throw new BadRequestException({
                    status: 'fail',
                    data: obj,
                });
            }

            await this.happeningsService.updateEvent(id, {
                ...event,
                thumbnail: file,
            });
        }

        return {
            status: 'success',
            data: null,
        };
    }

    @Protected()
    @Innocent()
    @Author('happening')
    @Get('/:id/start')
    @log('start a happening')
    async startHappening(
        @I18n() i18n: I18nContext,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<StartHappeningResponse> {
        try {
            const connectString = await this.happeningsService.startHappening(
                id,
            );

            return {
                status: 'success',
                data: {
                    connectString,
                },
            };
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            } else if (e instanceof AllServersInUseError) {
                throw new InternalServerErrorException({
                    status: 'fail',
                    data: {
                        reason: 'NO_EMPTY_SERVERS',
                    },
                    message: i18n.t('happening.no_empty_servers'),
                });
            } else {
                this.logger.error(new Error('failed to start a happening'));
                throw new InternalServerErrorException();
            }
        }
    }

    @Protected()
    @Innocent()
    @Author('happening')
    @Get('/:id/end')
    @log('end happening')
    async endHappening(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<EndHappeningResponse> {
        try {
            await this.happeningsService.endHappening(id);

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            this.logger.error(new Error('failed to end happening'));
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Innocent()
    @Author('happening')
    @Delete('/:id/delete')
    @log('delete happening')
    async deleteHappening(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<DeleteHappeningResponse> {
        try {
            await this.happeningsService.deleteHappening(id);

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            this.logger.error(new Error('failed to delete happening'));
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Innocent()
    @Post('/:id/interested')
    async setIsInterested(
        @Req() req: AuthedRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SetIsInterestedInHappeningResponse> {
        const isInterested =
            await this.happeningsService.isUserInterestedHappening({
                userId: req.user.id,
                happeningId: id,
            });

        const authorId = await this.happeningsService.getHappeningAuthorId(id);

        if (authorId == req.user.id) {
            throw new NotAcceptableException({
                status: 'fail',
                message:
                    "Can't be uninterested in own happening! You can delete it if you are no longer interested in it",
            });
        } else {
            await this.happeningsService.setIsUserInterestedInHappening(
                id,
                req.user.id,
                !isInterested,
            );
        }

        return {
            status: 'success',
            data: null,
        };
    }

    @Protected()
    @Innocent()
    @Get('/:id/interested')
    async getHappeningInterestedPlayers(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<GetInterestedUsersResponse> {
        const players =
            await this.happeningsService.getHappeningInterestedPlayers(id);

        return {
            status: 'success',
            data: players,
        };
    }

    @Protected()
    @Innocent()
    @Put('/:happeningId/in-team/:userId')
    @log('update whether a player in team or not')
    async updateIsPlayerInTeam(
        @Param('happeningId', ParseIntPipe) happeningId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<UpdateIsPlayerInTeamResponse> {
        try {
            await this.happeningsService.updateIsPlayerInTeam(
                happeningId,
                userId,
            );

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            this.logger.error(
                new Error('failed to update whether a player in team or not'),
            );
            throw new InternalServerErrorException();
        }
    }

    @Protected()
    @Get('/:id')
    async getHappening(
        @Req() req: AuthedRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<GetHappeningResponse> {
        if (await this.happeningsService.exists(id)) {
            const type = await this.happeningsService.getHappeningType(id);
            let happening: Happening;

            if (type == HappeningType.Run) {
                happening = await this.happeningsService.getRunById(
                    id,
                    req.user.id,
                );
            } else if (type === HappeningType.Event) {
                happening = await this.happeningsService.getEventById(
                    id,
                    req.user.id,
                );
            }

            return {
                status: 'success',
                data: happening!,
            };
        }

        throw new NotFoundException({
            status: 'fail',
            data: null,
        });
    }

    @Protected()
    @Innocent()
    @Get()
    async getHappenings(
        @Req() req: AuthedRequest,
    ): Promise<GetHappeningsResponse> {
        const happenings = await this.happeningsService.getHappenings(
            req.user.id,
        );

        return {
            status: 'success',
            data: happenings,
        };
    }
}
