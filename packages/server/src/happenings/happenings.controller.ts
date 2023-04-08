import {
    Body,
    Controller,
    Delete,
    Get,
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
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Protected } from 'src/decorators/protected.decorator';
import { AuthorGuard } from 'src/guards/author.guard';
import { Author } from 'src/decorators/author.decorator';

@UseGuards(AuthorGuard)
@Controller()
export class HappeningsController {
    constructor(private readonly happeningsService: HappeningsService) { }

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
        let thumbnail: string | null = null;
        const res = (file: Express.Multer.File) =>
            new Promise<string>((resolve, reject) => {
                //TODO: Move this thing out of the controller. Maybe create a separate service for it or smth
                const filename = uuidv4() + '.' + file.mimetype.split('/')[1];

                fs.writeFile(
                    './public/' + filename,
                    file.buffer,
                    async (err) => {
                        if (err === null) {
                            resolve(filename);
                        }

                        reject();
                    },
                );
            });

        if (file) {
            try {
                thumbnail = await res(file);
            } catch (e) {
                console.log("UH OH, seems like you're fucked");
            }
        }

        try {
            const { id } = await this.happeningsService.createEvent({
                ...data,
                thumbnail,
                authorId: req.user.id as number,
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
        }
    }

    @Protected()
    @Author('happening')
    @Get('/:id/start')
    async startHappening(@Req() req) {
        try {
            await this.happeningsService.startHappening(
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
        }
    }

    @Protected()
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
        } catch (e) { }
    }
}
