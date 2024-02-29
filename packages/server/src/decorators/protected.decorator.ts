import { SetMetadata, applyDecorators } from '@nestjs/common';

export const Protected = (forced = true) => {
    return applyDecorators(
        SetMetadata('protected', true),
        SetMetadata('forced', forced),
    );
};
