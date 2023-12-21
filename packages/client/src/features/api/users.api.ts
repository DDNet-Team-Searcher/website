import { setCredentails, setIsAuthed } from '@/store/slices/user';
import {
    BanUserRequest,
    BanUserResponse,
    FollowUserResponse,
    GetProfileResponse,
    GetUserCredentialsResponse,
    LoginUserRequest,
    LoginUserResponse,
    LogoutUserResponse,
    RegisterUserRequest,
    RegisterUserResponse,
    ReportUserRequest,
    ReportUserResponse,
    UnbanUserRequest,
    UnbanUserResponse,
    UpdateAvatarResponse,
    UpdateEmailRequest,
    UpdateEmailRespone,
    UpdatePasswordRequest,
    UpdatePasswordResponse,
    UpdateUsernameRequest,
    UpdateUsernameResponse,
} from '@app/shared/types/api.type';
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
            }),
        }),
        getCredentials: build.query<GetUserCredentialsResponse, void>({
            query: () => `/credentials`,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    if (data.status === 'success' && data.data) {
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
                body,
            }),
        }),
        updateUsername: build.mutation<
            UpdateUsernameResponse,
            UpdateUsernameRequest
        >({
            query: (body) => ({
                url: `/profile/username`,
                method: 'POST',
                body,
            }),
        }),
        updateEmail: build.mutation<UpdateEmailRespone, UpdateEmailRequest>({
            query: (body) => ({
                url: `/profile/email`,
                method: 'POST',
                body,
            }),
        }),
        updatePassword: build.mutation<
            UpdatePasswordResponse,
            UpdatePasswordRequest
        >({
            query: (body) => ({
                url: `/profile/password`,
                method: 'POST',
                body,
            }),
        }),
        getProfile: build.query<GetProfileResponse, number>({
            query: (userId) => `/profile/${userId}`,
        }),
        followUser: build.mutation<FollowUserResponse, number>({
            query: (userId) => ({
                url: `user/${userId}/follow`,
                method: 'PUT',
            }),
        }),
        reportUser: build.mutation<ReportUserResponse, ReportUserRequest>({
            query: ({ userId, reason }) => ({
                url: `user/${userId}/report`,
                method: 'POST',
                body: { reason },
            }),
        }),
        banUser: build.mutation<BanUserResponse, BanUserRequest>({
            query: ({ userId, reason }) => ({
                url: `user/${userId}/ban`,
                method: 'POST',
                body: { reason },
            }),
        }),
        unbanUser: build.mutation<UnbanUserResponse, UnbanUserRequest>({
            query: ({ userId }) => ({
                url: `user/${userId}/unban`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetCredentialsQuery,
    useLazyGetCredentialsQuery,
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
