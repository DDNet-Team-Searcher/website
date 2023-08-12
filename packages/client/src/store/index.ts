import { happeningsApi } from '@/features/api/happenings.api';
import { usersAPI } from '@/features/api/users.api';
import { notificationsApi } from '@/features/api/notifications.api';
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app';
import hintsReducer from './slices/hints';
import happeningsReducer from './slices/happenings';
import userReducer from './slices/user';
import profileReducer from './slices/profile';
import { searchApi } from '@/features/api/search.api';

export const store = configureStore({
    reducer: {
        user: userReducer,
        hints: hintsReducer,
        app: appReducer,
        happenings: happeningsReducer,
        profile: profileReducer,
        [happeningsApi.reducerPath]: happeningsApi.reducer,
        [usersAPI.reducerPath]: usersAPI.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
        [searchApi.reducerPath]: searchApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(usersAPI.middleware)
            .concat(happeningsApi.middleware)
            .concat(notificationsApi.middleware)
            .concat(searchApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {runs: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
