import { setEvents, setRuns } from '@/store/slices/happenings';
import {
    CreateEventRequest,
    CreateEventResponse,
    CreateRunRequest,
    CreateRunResponse,
    GetAllEventsResponse,
    GetAllRunsResponse,
    GetInterestedUsersResponse,
    GetReviewsResponse,
    StartHappeningResponse,
} from '@/types/api.type';
import { intoFormData } from '@/utils/intoFormData';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseQuery } from '.';

export const happeningsApi = createApi({
    reducerPath: 'happeningsApi',
    baseQuery: baseQuery('happenings'),
    endpoints: (build) => ({
        createRun: build.mutation<CreateRunResponse, CreateRunRequest>({
            query: (body) => ({
                url: `/create/run`,
                method: 'POST',
                body,
            }),
        }),
        createEvent: build.mutation<CreateEventResponse, CreateEventRequest>({
            query: (body) => ({
                url: `/create/event`,
                method: 'POST',
                body: intoFormData(body),
            }),
        }),
        startHappening: build.query<StartHappeningResponse, number>({
            query: (id) => `/${id}/start`,
        }),
        //TODO: add response type
        endHappening: build.query<string, number>({
            query: (id) => `/${id}/end`,
        }),
        deleteHappening: build.mutation<string, number>({
            query: (id) => ({
                url: `/${id}/delete`,
                method: 'DELETE',
            }),
        }),
        //FIXME: DO THE FUCKING TYPE U LAZY WHORE
        setIsInterestedInHappening: build.mutation<string, number>({
            query: (id) => ({
                url: `/${id}/interested`,
                method: 'POST',
            }),
        }),
        getAllRuns: build.query<GetAllRunsResponse, void>({
            query: () => `/runs`,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    if (data.status === 'success') {
                        dispatch(setRuns(data.data.runs));
                    }
                } catch (e) {
                    console.log(e);
                }
            },
        }),
        getAllEvents: build.query<GetAllEventsResponse, void>({
            query: () => `/events`,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    if (data.status === 'success') {
                        dispatch(setEvents(data.data.events));
                    }
                } catch (e) {
                    console.log(e);
                }
            },
        }),
        //TODO: add response type
        getHappeningInterestedPlayers: build.query<
            GetInterestedUsersResponse,
            number
        >({
            query: (id) => `/${id}/interested`,
        }),
        updateIsPlayerInTeam: build.mutation<
            number,
            { userId: number; happeningId: number }
        >({
            query: ({ userId, happeningId }) => ({
                url: `/${happeningId}/in-team/${userId}`,
                method: 'PUT',
            }),
        }),
        getReviews: build.query<GetReviewsResponse, number>({
            query: (happeningId) => `/${happeningId}/reviews`
        }),
        createReview: build.mutation<
            string,
            { happeningId: number; userId: number, data: { text: null | string, rate: number } }
        >({
            query: ({ happeningId, userId, data }) => ({
                url: `/${happeningId}/reviews/${userId}`,
                method: 'POST',
                body: data
            }),
        }),
    }),
});

export const {
    useCreateRunMutation,
    useCreateEventMutation,
    useLazyStartHappeningQuery,
    useLazyEndHappeningQuery,
    useDeleteHappeningMutation,
    useSetIsInterestedInHappeningMutation,
    useGetAllRunsQuery,
    useGetAllEventsQuery,
    useGetHappeningInterestedPlayersQuery,
    useUpdateIsPlayerInTeamMutation,
    useGetReviewsQuery,
    useCreateReviewMutation
} = happeningsApi;
