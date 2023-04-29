import { Controller, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('/notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get('/:id')
    async markAsSeen(@Param('id') id: string) {
        await this.notificationsService.markAsSeen(parseInt(id));

        return {
            status: 'success',
            data: null,
        };
    }
}
