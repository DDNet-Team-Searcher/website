import { SetMetadata } from '@nestjs/common';

/**
 * Use only after @Protected otherwise you will be fucked :)
 */
export const Permission = (permissionBitMask: number) =>
    SetMetadata('permission', permissionBitMask);
