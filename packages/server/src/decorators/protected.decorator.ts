import { SetMetadata } from '@nestjs/common';

export const Protected = () => SetMetadata('protected', true);
