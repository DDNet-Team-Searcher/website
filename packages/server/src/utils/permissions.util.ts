import { User } from '@app/shared/types/User.type';

export function getPermissions(
    permissionsArray: User['permissions'][],
): User['permissions'] {
    const permissions: User['permissions'] = {
        canDeleteHappenings: false,
        canBan: false,
        canManagePosts: false,
        canManageRoles: false,
    };

    for (const perms of permissionsArray) {
        for (const [perm, enabled] of Object.entries(perms)) {
            if (enabled) {
                permissions[perm] = enabled;
            }
        }

        if (Object.values(permissions).every((perm) => perm)) {
            break;
        }
    }

    return permissions;
}

//TODO: rename it
export function objToInt(obj: User['permissions']) {
    return (
        +obj.canBan |
        (+obj.canManageRoles << 1) |
        (+obj.canDeleteHappenings << 2) |
        (+obj.canManagePosts << 3)
    );
}
