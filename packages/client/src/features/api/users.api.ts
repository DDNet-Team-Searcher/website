import { setCredentails, setIsAuthed } from '@/store/slices/user';
import {
    GetProfile,
    LoginUserRequest,
    LoginUserResponse,
    RegisterUserRequest,
    RegisterUserResponse,
    UpdateEmailRequest,
    UpdateEmailRespone,
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
        updateAvatar: build.mutation<{}, FormData>({
            query: (body) => ({
                url: `/profile/avatar`,
                method: 'POST',
                body
            }),
        }),
        updateUsername: build.mutation<UpdateUsernameRequest, UpdateUsernameResponse>({
            query: (body) => ({
                url: `/profile/username`,
                method: 'POST',
                body
            })
        }),
        updateEmail: build.mutation<UpdateEmailRequest, UpdateEmailRespone>({
            query: (body) => ({
                url: `/profile/email`,
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
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetCredentialsQuery,
    useUpdateAvatarMutation,
    useUpdateUsernameMutation,
    useUpdateEmailMutation,
    useLazyGetProfileQuery,
    useFollowUserMutation,
} = usersAPI;
