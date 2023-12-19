import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Protected } from 'src/decorators/protected.decorator';
import { SearchService } from './search.service';
import { InnocentGuard } from 'src/guards/innocent.guard';
import { Innocent } from 'src/decorators/innocent.decorator';

@UseGuards(InnocentGuard)
@Controller()
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Innocent()
    @Protected()
    @Get('/search')
    async search(
        @Query('query') query: string | null,
        @Query('page') page: string | null,
        @Query('sort') type: string | null,
        @Req() req,
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
