import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Protected } from 'src/decorators/protected.decorator';
import { SearchService } from './search.service';
import { InnocentGuard } from 'src/guards/innocent.guard';
import { Innocent } from 'src/decorators/innocent.decorator';
import { AuthedRequest } from 'src/types/AuthedRequest.type';

@UseGuards(InnocentGuard)
@Controller()
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Innocent()
    @Protected()
    @Get('/search')
    async search(
        @Query('query') query: string | undefined,
        @Query('page') page: string | undefined,
        @Query('sort') type: string | undefined,
        @Req() req: AuthedRequest,
    ) {
        const searchResult = await this.searchService.search(
            req.user.id,
            query || '',
            {
                page: (Number(page) || 1) - 1,
                sort: (type || 'all') as 'all' | 'events' | 'runs' | 'users',
            },
        );

        return {
            status: 'success',
            data: {
                ...searchResult,
            },
        };
    }
}
