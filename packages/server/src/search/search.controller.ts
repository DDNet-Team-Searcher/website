import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Protected } from 'src/decorators/protected.decorator';
import { SearchService } from './search.service';

@Controller()
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Protected()
    @Get('/search')
    async search(
        @Query('query') query: string | null,
        @Query('page') page: string | null,
        @Req() req,
    ) {
        const searchResult = await this.searchService.search(
            req.user.id,
            query || "",
            {
                page: (Number(page) || 1) - 1,
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
