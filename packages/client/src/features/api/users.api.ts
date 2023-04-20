import { setCredentails, setIsAuthed } from '@/store/slices/user';
import {
    GetProfile,
    LoginUserRequest,
    LoginUserResponse,
    RegisterUserRequest,
    RegisterUserResponse,
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
                        dispatch(setCredentails(data.data));
                        dispatch(setIsAuthed(true));
                    }
                } catch (e) {
                    dispatch(setIsAuthed(false));
                    console.log(e);
                }
            },
        }),
        getProfile: build.query<GetProfile, number>({
            query: (userId) => `/profile/${userId}`,
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetCredentialsQuery,
    useLazyGetProfileQuery,
} = usersAPI;
