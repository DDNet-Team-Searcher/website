import { User } from "@app/shared/types/User.type"

export function getPermissions(permissionsArray: User['permissions'][]): User['permissions'] {
    const permissions: User['permissions'] = {
        canDeleteHappenings: false,
        canBan: false,
        canManagePosts: false,
        canManageRoles: false
    };

    for (const perms of permissionsArray) {
        for (const [perm, enabled] of Object.entries(perms)) {
            if (enabled) {
                permissions[perm] = enabled;
            }

        }

        if (Object.values(permissions).every(perm => perm)) {
            break;
        }
    }

    return permissions;
}
