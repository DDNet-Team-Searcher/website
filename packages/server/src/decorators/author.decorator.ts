import { SetMetadata } from '@nestjs/common';

/**
 * If you use this decorator you have to have a param called id. Otherwise everything will brake!
 * Your url decorator should look smth like this @Post('/some/url/:id')
 */
export const Author = (param: 'happening') => SetMetadata('author', param);
