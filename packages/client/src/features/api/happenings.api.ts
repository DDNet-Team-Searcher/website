import { setPopularEvents, setPopularRuns } from '@/store/slices/happenings';
import {
    CreateEventRequest,
    CreateEventResponse,
    CreateReviewRequest,
    CreateReviewResponse,
    CreateRunRequest,
    CreateRunResponse,
    DeleteHappeningResponse,
    EndHappeningResponse,
    GetAllEventsResponse,
    GetAllRunsResponse,
    GetInterestedUsersResponse,
    GetReviewsResponse,
    SetIsInterestedInHappeningResponse,
    StartHappeningResponse,
    UpdateIsPlayerInTeamRequest,
    UpdateIsPlayerInTeamResponse,
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
        updateHappening: build.mutation<any, { id: number; data: any }>({
            query: ({ id, data }) => ({
                url: `/${id}/update`,
                method: 'PUT',
                body: intoFormData(data),
            }),
        }),
        startHappening: build.query<StartHappeningResponse, number>({
            query: (id) => `/${id}/start`,
        }),
        endHappening: build.query<EndHappeningResponse, number>({
            query: (id) => `/${id}/end`,
        }),
        deleteHappening: build.mutation<DeleteHappeningResponse, number>({
            query: (id) => ({
                url: `/${id}/delete`,
                method: 'DELETE',
            }),
        }),
        setIsInterestedInHappening: build.mutation<
            SetIsInterestedInHappeningResponse,
            number
        >({
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
                        dispatch(setPopularRuns(data.data.runs));
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
                        dispatch(setPopularEvents(data.data.events));
                    }
                } catch (e) {
                    console.log(e);
                }
            },
        }),
        getHappeningInterestedPlayers: build.query<
            GetInterestedUsersResponse,
            number
        >({
            query: (id) => `/${id}/interested`,
        }),
        updateIsPlayerInTeam: build.mutation<
            UpdateIsPlayerInTeamResponse,
            UpdateIsPlayerInTeamRequest
        >({
            query: ({ userId, happeningId }) => ({
                url: `/${happeningId}/in-team/${userId}`,
                method: 'PUT',
            }),
        }),
        getReviews: build.query<GetReviewsResponse, number>({
            query: (happeningId) => `/${happeningId}/reviews`,
        }),
        createReview: build.mutation<CreateReviewResponse, CreateReviewRequest>(
            {
                query: ({ happeningId, userId, data }) => ({
                    url: `/${happeningId}/reviews/${userId}`,
                    method: 'POST',
                    body: data,
                }),
            },
        ),
    }),
});

export const {
    useCreateRunMutation,
    useCreateEventMutation,
    useUpdateHappeningMutation,
    useLazyStartHappeningQuery,
    useLazyEndHappeningQuery,
    useDeleteHappeningMutation,
    useSetIsInterestedInHappeningMutation,
    useGetAllRunsQuery,
    useGetAllEventsQuery,
    useGetHappeningInterestedPlayersQuery,
    useUpdateIsPlayerInTeamMutation,
    useGetReviewsQuery,
    useCreateReviewMutation,
} = happeningsApi;
