import type { Role } from '@prisma/client';
import type { User } from 'src/types/User.type';

export const computePersmissions = (
    data: Omit<User, 'permissions' | 'bans'> & {
        roles: { role: Omit<Role, 'id' | 'name' | 'color' | 'url'> }[];
    },
): User => {
    const permissions: { [key in keyof User['permissions']]: boolean } = {
        canBan: false,
        canDeleteHappenings: false,
        canManagePosts: false,
        canManageRoles: false,
    };

    for (let role of data.roles) {
        Object.keys(role.role).forEach((el) => {
            console.log(el);
            if (!permissions[el]) permissions[el] = role.role[el];
        });
    }

    delete data.roles;

    return {
        ...data,
        permissions,
    } as any;
};
