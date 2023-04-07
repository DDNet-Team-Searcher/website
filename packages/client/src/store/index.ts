import { happeningsApi } from '@/features/api/happenings.api';
import { usersAPI } from '@/features/api/users.api';
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app';
import hintsReducer from './slices/hints';
import happeningsReducer from './slices/happenings';
// import { usersApi } from "../api/users-api"
// import { happeningsApi } from "../api/happenings-api"
// import { reviewsApi } from "../api/reviews-api"
// import { administrationApi } from "../api/administration-api"
import userReducer from './slices/user';

export const store = configureStore({
    reducer: {
        user: userReducer,
        hints: hintsReducer,
        app: appReducer,
        happenings: happeningsReducer,
        [happeningsApi.reducerPath]: happeningsApi.reducer,
        [usersAPI.reducerPath]: usersAPI.reducer,
        // [usersApi.reducerPath]: usersApi.reducer,
        // [happeningsApi.reducerPath]: happeningsApi.reducer,
        // [reviewsApi.reducerPath]: reviewsApi.reducer,
        // [administrationApi.reducerPath]: administrationApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(usersAPI.middleware)
            .concat(happeningsApi.middleware),
    // getDefaultMiddleware().concat(usersApi.middleware, happeningsApi.middleware, reviewsApi.middleware, administrationApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {runs: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
