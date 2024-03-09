import { setCredentails, setIsAuthed } from '@/store/slices/user';
import {
    BanUserRequest,
    BanUserResponse,
    BannedUsersResponse,
    FollowUserResponse,
    GetProfileHappenings,
    GetProfileResponse,
    GetProfileReviews,
    GetUserCredentialsResponse,
    GetUsersResponse,
    LoginUserRequest,
    LoginUserResponse,
    LogoutUserResponse,
    RegisterUserRequest,
    RegisterUserResponse,
    ReportUserRequest,
    ReportUserResponse,
    ReportsRespone,
    SetRoleResponse,
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
import { baseApi } from './base.api';

export const usersAPI = baseApi.injectEndpoints({
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
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    if (data.status === 'success' && data.data) {
                        dispatch(setCredentails(data.data));
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
        getProfileReviews: build.query<GetProfileReviews, number>({
            query: (userId) => `/profile/${userId}/reviews`,
        }),
        getProfileHappenings: build.query<
            GetProfileHappenings,
            { userId: number; params: Record<string, string> }
        >({
            query: ({ userId, params }) =>
                `/profile/${userId}/happenings?${new URLSearchParams(
                    params,
                ).toString()}`,
        }),
        followUser: build.mutation<FollowUserResponse, number>({
            query: (userId) => ({
                url: `user/${userId}/follow`,
                method: 'PUT',
            }),
        }),
        reportUser: build.mutation<
            ReportUserResponse,
            ReportUserRequest & { userId: number }
        >({
            query: ({ userId, reason }) => ({
                url: `/user/${userId}/report`,
                method: 'POST',
                body: { reason },
            }),
        }),
        banUser: build.mutation<
            BanUserResponse,
            BanUserRequest & { userId: number }
        >({
            query: ({ userId, reason }) => ({
                url: `/user/${userId}/ban`,
                method: 'POST',
                body: { reason },
            }),
        }),
        unbanUser: build.mutation<UnbanUserResponse, UnbanUserRequest>({
            query: ({ userId }) => ({
                url: `/user/${userId}/unban`,
                method: 'POST',
            }),
        }),
        getBannedUsers: build.query<BannedUsersResponse, void>({
            query: () => ({
                url: `/users/banned`,
            }),
        }),
        getReports: build.query<ReportsRespone, void>({
            query: () => ({
                url: `/reports`,
            }),
        }),
        getUsers: build.query<GetUsersResponse, void>({
            query: () => ({
                url: `/users`,
            }),
        }),
        setRole: build.mutation<
            SetRoleResponse,
            { userId: number; roleId: number }
        >({
            query: ({ userId, roleId }) => ({
                url: `/user/${userId}/role/${roleId}`,
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
    useGetProfileQuery,
    useGetProfileReviewsQuery,
    useLazyGetProfileHappeningsQuery,
    useFollowUserMutation,
    useReportUserMutation,
    useBanUserMutation,
    useUnbanUserMutation,
    useGetBannedUsersQuery,
    useGetReportsQuery,
    useGetUsersQuery,
    useSetRoleMutation,
} = usersAPI;
