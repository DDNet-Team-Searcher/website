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
import { CreateEvenDTO } from './dto/create-event.dto';
import { CreateRunDTO } from './dto/create-run.dto';
import { HappeningsService } from './happenings.service';
import { Protected } from 'src/decorators/protected.decorator';
import { AuthorGuard } from 'src/guards/author.guard';
import { Author } from 'src/decorators/author.decorator';
// import { computeConnectString } from 'src/utils/computedFields';
import { HappeningWithConnectString } from 'src/types/HappeningWithConnectString.type';
import { Event, Run } from 'src/types/Happenings.type';

@UseGuards(AuthorGuard)
@Controller()
export class HappeningsController {
    constructor(private readonly happeningsService: HappeningsService) {}

    @Protected()
    @Post('/create/run')
    async createRun(@Req() req, @Body() data: CreateRunDTO) {
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
        @Body() data: CreateEvenDTO,
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
        const runs = await this.happeningsService.getAllRuns(req.user.id);
        const res: (Run | HappeningWithConnectString<Run>)[] = [];

        // for (let run of runs) {
        //     if (run.server) {
        //         res.push(computeConnectString(run));
        //     } else {
        // res.push(run);
        //     }
        // }

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
        const events = await this.happeningsService.getAllEvents(req.user.id);
        const res: (Event | HappeningWithConnectString<Event>)[] = [];

        // for (let event of events) {
        //     if (event.server) {
        //         res.push(computeConnectString(event));
        //     } else {
        //         res.push(event);
        //     }
        // }

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
