import { setCredentails, setIsAuthed } from '@/store/slices/user';
import {
    GetProfile,
    LoginUserRequest,
    LoginUserResponse,
    LogoutUserResponse,
    RegisterUserRequest,
    RegisterUserResponse,
    ReportUserRequest,
    ReportUserResponse,
    UpdateAvatarResponse,
    UpdateEmailRequest,
    UpdateEmailRespone,
    UpdatePasswordRequest,
    UpdatePasswordResponse,
    UpdateUsernameRequest,
    UpdateUsernameResponse,
} from '@/types/api.type';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '.';

export const usersAPI = createApi({
    reducerPath: 'usersAPI',
    baseQuery: baseQuery(),
    endpoints: (build) => ({
        register: build.mutation<RegisterUserResponse, RegisterUserRequest>({
            query: (body) => ({
                url: `/register`,
                method: 'POST',
                body,
            }),
        }),
        login: build.mutation<LoginUserResponse, LoginUserRequest>({
            query: (body) => ({
                url: `/login`,
                method: 'POST',
                body,
            }),
        }),
        logout: build.mutation<LogoutUserResponse, void>({
            query: () => ({
                url: `/logout`,
                method: 'DELETE',
            })
        }),
        getCredentials: build.query<{ data: any }, void>({
            query: () => `/credentials`,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    if (data.data) {
                        dispatch(setCredentails(data.data.user));
                        dispatch(setIsAuthed(true));
                    }
                } catch (e) {
                    dispatch(setIsAuthed(false));
                    console.log(e);
                }
            },
        }),
        updateAvatar: build.mutation<UpdateAvatarResponse, FormData>({
            query: (body) => ({
                url: `/profile/avatar`,
                method: 'POST',
                body
            }),
        }),
        updateUsername: build.mutation<UpdateUsernameResponse, UpdateUsernameRequest>({
            query: (body) => ({
                url: `/profile/username`,
                method: 'POST',
                body
            })
        }),
        updateEmail: build.mutation<UpdateEmailRespone, UpdateEmailRequest>({
            query: (body) => ({
                url: `/profile/email`,
                method: 'POST',
                body
            })
        }),
        updatePassword: build.mutation<UpdatePasswordResponse, UpdatePasswordRequest>({
            query: (body) => ({
                url: `/profile/password`,
                method: 'POST',
                body
            })
        }),
        getProfile: build.query<GetProfile, number>({
            query: (userId) => `/profile/${userId}`,
        }),
        followUser: build.mutation<{}, number>({
            query: (userId) => ({
                url: `user/${userId}/follow`,
                method: 'PUT',
            }),
        }),
        reportUser: build.mutation<ReportUserResponse, ReportUserRequest>({
            query: ({ userId, reason }) => ({
                url: `user/${userId}/report`,
                method: 'POST',
                body: { reason }
            })
        }),
        banUser: build.mutation({
            query: ({ userId, reason }) => ({
                url: `user/${userId}/ban`,
                method: 'POST',
                body: { reason }
            })
        }),
        unbanUser: build.mutation({
            query: ({ userId }) => ({
                url: `user/${userId}/unban`,
                method: 'POST',
            })
        })
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetCredentialsQuery,
    useUpdateAvatarMutation,
    useUpdateUsernameMutation,
    useUpdateEmailMutation,
    useUpdatePasswordMutation,
    useLazyGetProfileQuery,
    useFollowUserMutation,
    useReportUserMutation,
    useBanUserMutation,
    useUnbanUserMutation,
} = usersAPI;
