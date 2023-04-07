import { Nullable } from '@/types/Nullable.type';
import { User } from '@/types/User.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  user: Nullable<User>;
  isAuthed: boolean | null;
}

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
