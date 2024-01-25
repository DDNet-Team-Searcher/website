import { Role } from '@app/shared/types/Role.type';
import { SetMetadata } from '@nestjs/common';

/**
 * Use only after @Protected otherwise you will be fucked :)
 */
export const Permission = (role: Role) => SetMetadata('permission', role);
