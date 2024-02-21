import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationSeenResponse } from '@app/shared/types/api.type';
import { Protected } from 'src/decorators/protected.decorator';

@Controller('/notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Protected()
    @Get('/:id')
    async markAsSeen(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<NotificationSeenResponse> {
        await this.notificationsService.markAsSeen(id);

        return {
            status: 'success',
            data: null,
        };
    }
}
