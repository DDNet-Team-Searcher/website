import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app';
import hintsReducer from './slices/hints';
import happeningsReducer from './slices/happenings';
import userReducer from './slices/user';
import profileReducer from './slices/profile';
import { baseApi } from '@/features/api/base.api';

export const store = configureStore({
    reducer: {
        user: userReducer,
        hints: hintsReducer,
        app: appReducer,
        happenings: happeningsReducer,
        profile: profileReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {runs: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
