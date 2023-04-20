import { Nullable } from '@/types/Nullable.type';
import { User } from '@/types/User.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
    user: Nullable<User>;
    isAuthed: boolean | null;
};

const initialState: AppState = {
    user: {
        id: null,
        username: null,
        email: null,
        tier: null,
        createdAt: null,
        updatedAt: null,
        verified: null,
        avatar: null,
        perimissions: {
            canBan: null,
            canDeleteHappenings: null,
            canManageRoles: null,
            canManagePosts: null,
        },
        banned: {
            isBanned: null,
            reason: null,
        },
    },
    isAuthed: null,
};

export const getUserStats = (username: string) => {
    return async () => {
        const req = await fetch(
            `https://ddstats.org/ddnet-693575f.json?sql=SELECT+*%2C+SUM%28Points%29+FROM%0D%0A%28SELECT+race.Timestamp%2C+maps.Points+FROM+race+INNER+JOIN+maps+ON+maps.Map+%3D+race.Map+WHERE+race.Name+%3D+%22${encodeURI(
                username,
            )}%22+GROUP+BY+race.Map%29%0D%0AGROUP+BY+strftime%28%22%25Y%22%2C+Timestamp%29`,
        );

        return await req.json();
    };
};

export const getUserFavoriteServer = (username: string) => {
    return async (): Promise<string | undefined> => {
        const req = await fetch(
            `https://ddstats.org/ddnet-0f28546.json?sql=SELECT+Server+FROM%0D%0A%28SELECT+race.Timestamp%2C+race.Server%2C+maps.Points+FROM+race+INNER+JOIN+maps+ON+maps.Map+%3D+race.Map+WHERE+race.Name+%3D+%22${username}%22+GROUP+BY+race.Map%29%0D%0AGROUP+BY+Server+ORDER+BY+COUNT%28Server%29+DESC+LIMIT+1`,
        );

        //@ts-ignore TODO: Add type here
        return await (
            await req.json()
        ).rows[0];
    };
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentails(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        setIsAuthed(state, action: PayloadAction<boolean>) {
            state.isAuthed = action.payload;
        },
    },
});

export const { setIsAuthed, setCredentails } = userSlice.actions;

export default userSlice.reducer;
