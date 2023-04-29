import { setNotificationSeen } from '@/store/slices/user';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '.';

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: baseQuery('notifications'),
    endpoints: (build) => ({
        setNotificationSeen: build.query<{}, number>({
            query: (id) => `/${id}`,
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;

                    dispatch(setNotificationSeen(arg));
                } catch (e) {
                    console.log(e);
                }
            },
        }),
    }),
});

export const { useLazySetNotificationSeenQuery } = notificationsApi;
