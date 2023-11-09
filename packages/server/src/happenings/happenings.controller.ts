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
    RawBodyRequest,
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
import { Request } from 'express';
import { HappeningType } from '@prisma/client';
import { Validator } from 'class-validator';

@UseGuards(AuthorGuard)
@Controller()
export class HappeningsController {
    constructor(private readonly happeningsService: HappeningsService) { }

    @Protected()
    @Post('/create/run')
    async createRun(@Req() req, @Body() data: RunDTO) {
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

    @Protected()
    @Post('/create/event')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async createEvent(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
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

    @Protected()
    @Author('happening')
    @Put('/:id/update')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async updateHappening(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Body() body
    ) {
        const happeningId = parseInt(req.params.id);

        const happeningType = await this.happeningsService.getHappeningType(happeningId);

        if (happeningType == HappeningType.Run) {
            const run = new RunDTO();

            run.mapName = body.mapName;
            run.teamSize = body.teamSize ? parseInt(body.teamSize) : body.teamSize;
            run.startAt = body.startAt;
            run.description = body.description;
            run.place = body.place ? parseInt(body.place) : body.place;

            let errors = await new Validator().validate(run);
            let obj: Record<string, string> = {};

            if (errors.length) {
                for (const err of errors) {
                    obj[err.property] = Object.values(err.constraints!)[0]
                }

                throw new BadRequestException({
                    status: 'fail',
                    data: obj
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
            let obj: Record<string, string> = {};

            if (errors.length) {
                for (const err of errors) {
                    obj[err.property] = Object.values(err.constraints!)[0]
                }

                throw new BadRequestException({
                    status: 'fail',
                    data: obj
                });
            }

            await this.happeningsService.updateEvent(happeningId, {
                ...event,
                thumbnail: file
            });
        }

        return {
            status: 'success',
            data: null,
        };
    }

    @Protected()
    @Author('happening')
    @Get('/:id/start')
    async startHappening(@Req() req) {
        try {
            const success = await this.happeningsService.startHappening(
                parseInt(req.params.id),
            );

            if (!success) {
                throw new InternalServerErrorException({
                    status: 'fail',
                    data: {
                        reason: 'NO_EMPTY_SERVERS',
                    },
                    message: 'Im sorry but all servers are in use',
                });
            }

            return {
                status: 'success',
                data: null,
            };
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            } else {
                console.log(e);
                throw new InternalServerErrorException();
            }
        }
    }

    @Protected()
    @Author('happening')
    @Get('/:id/end')
    async endHappening(@Req() req) {
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

    @Protected()
    @Author('happening')
    @Delete('/:id/delete')
    async deleteHappening(@Req() req) {
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

    @Protected()
    @Post('/:id/interested')
    async setIsInterested(@Req() req) {
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

    @Protected()
    @Get('/runs')
    async getRuns(@Req() req) {
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

    @Protected()
    @Get('/events')
    async getEvents(@Req() req) {
        const ids = await this.happeningsService.getAllEventsIds();

        const events: Event[] = [];

        for (const id of ids) {
            const event = await this.happeningsService.getEventById(id.id, req.user.id);

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
