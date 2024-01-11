import { setNotificationSeen } from '@/store/slices/user';
import { NotificationSeenResponse } from '@app/shared/types/api.type';
import { baseApi } from './base.api';

export const notificationsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        setNotificationSeen: build.query<NotificationSeenResponse, number>({
            query: (id) => `/notifications/${id}`,
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
