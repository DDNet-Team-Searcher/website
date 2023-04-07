export type User = {
    id: number;
    username: string;
    email: string;
    tier: number;
    createdAt: number;
    updatedAt: number;
    verified: boolean;
    avatar: string | null;
    perimissions: {
        canBan: boolean;
        canDeleteHappenings: boolean;
        canManageRoles: boolean;
        canManagePosts: boolean;
    };
    banned: {
        isBanned: boolean;
        reason: string | null;
    };
};
