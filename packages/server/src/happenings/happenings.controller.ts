import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    InternalServerErrorException,
    Param,
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
import { Event, Run } from '@app/shared/types/Happening.type';
import { HappeningType } from '@prisma/client';
import { Validator } from 'class-validator';
import { InnocentGuard } from 'src/guards/innocent.guard';
import { Innocent } from 'src/decorators/innocent.decorator';
import { AllServersInUseError } from './happenings.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthedRequest } from 'src/types/AuthedRequest.type';

@UseGuards(AuthorGuard)
@UseGuards(InnocentGuard)
@Controller()
export class HappeningsController {
    constructor(private readonly happeningsService: HappeningsService) {}

    @Innocent()
    @Protected()
    @Post('/create/run')
    async createRun(@Req() req: AuthedRequest, @Body() data: RunDTO) {
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
                data: {
                    run,
                },
            };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    @Innocent()
    @Protected()
    @Post('/create/event')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async createEvent(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: AuthedRequest,
        @Body() data: EventDTO,
    ) {
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
                data: {
                    event,
                },
            };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    @Innocent()
    @Protected()
    @Author('happening')
    @Put('/:id/update')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async updateHappening(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: AuthedRequest,
        @Body() body,
    ) {
        const happeningId = parseInt(req.params.id);

        const happeningType = await this.happeningsService.getHappeningType(
            happeningId,
        );

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

            await this.happeningsService.updateRun(happeningId, run);
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

            await this.happeningsService.updateEvent(happeningId, {
                ...event,
                thumbnail: file,
            });
        }

        return {
            status: 'success',
            data: null,
        };
    }

    @Innocent()
    @Protected()
    @Author('happening')
    @Get('/:id/start')
    async startHappening(@Req() req: AuthedRequest, @I18n() i18n: I18nContext) {
        try {
            const connectString = await this.happeningsService.startHappening(
                parseInt(req.params.id),
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
                console.log(e);
                throw new InternalServerErrorException();
            }
        }
    }

    @Innocent()
    @Protected()
    @Author('happening')
    @Get('/:id/end')
    async endHappening(@Req() req: AuthedRequest) {
        try {
            await this.happeningsService.endHappening(parseInt(req.params.id));

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    @Innocent()
    @Protected()
    @Author('happening')
    @Delete('/:id/delete')
    async deleteHappening(@Req() req: AuthedRequest) {
        try {
            await this.happeningsService.deleteHappening(
                parseInt(req.params.id),
            );

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    @Innocent()
    @Protected()
    @Post('/:id/interested')
    async setIsInterested(@Req() req: AuthedRequest) {
        const happeningId = parseInt(req.params.id);

        const isInterested =
            await this.happeningsService.isUserInterestedHappening({
                userId: req.user.id,
                happeningId,
            });

        await this.happeningsService.setIsUserInterestedInHappening(
            happeningId,
            req.user.id,
            isInterested === null ? true : false,
        );
    }

    @Innocent()
    @Protected()
    @Get('/runs')
    async getRuns(@Req() req: AuthedRequest) {
        const ids = await this.happeningsService.getAllRunsIds();

        const runs: Run[] = [];

        for (const id of ids) {
            const run = await this.happeningsService.getRunById(
                id.id,
                req.user.id,
            );

            if (run) {
                runs.push(run);
            }
        }

        return {
            status: 'success',
            data: {
                runs,
            },
        };
    }

    @Innocent()
    @Protected()
    @Get('/events')
    async getEvents(@Req() req: AuthedRequest) {
        const ids = await this.happeningsService.getAllEventsIds();

        const events: Event[] = [];

        for (const id of ids) {
            const event = await this.happeningsService.getEventById(
                id.id,
                req.user.id,
            );

            if (event) {
                events.push(event);
            }
        }

        return {
            status: 'success',
            data: {
                events,
            },
        };
    }

    @Protected()
    @Get('/:id/interested')
    async getHappeningInterestedPlayers(@Param('id') id: string) {
        const players =
            await this.happeningsService.getHappeningInterestedPlayers(
                parseInt(id),
            );

        return {
            status: 'success',
            data: players[0],
        };
    }

    @Innocent()
    @Protected()
    @Put('/:happeningId/in-team/:userId')
    async updateIsPlayerInTeam(
        @Param('happeningId') happeningId: string,
        @Param('userId') userId: string,
    ) {
        try {
            await this.happeningsService.updateIsPlayerInTeam(
                parseInt(happeningId),
                parseInt(userId),
            );

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}
