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
    UpdateHappeningRequest,
    UpdateHappeningResponse,
    UpdateIsPlayerInTeamRequest,
    UpdateIsPlayerInTeamResponse,
} from '@app/shared/types/api.type';
import { intoFormData } from '@/utils/intoFormData';
import { baseApi } from './base.api';

const PREFIX = '/happenings';

export const happeningsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createRun: build.mutation<CreateRunResponse, CreateRunRequest>({
            query: (body) => ({
                url: `${PREFIX}/create/run`,
                method: 'POST',
                body,
            }),
        }),
        createEvent: build.mutation<CreateEventResponse, CreateEventRequest>({
            query: (body) => ({
                url: `${PREFIX}/create/event`,
                method: 'POST',
                body: intoFormData(body),
            }),
        }),
        updateHappening: build.mutation<
            UpdateHappeningResponse,
            UpdateHappeningRequest
        >({
            query: ({ id, data }) => ({
                url: `${PREFIX}/${id}/update`,
                method: 'PUT',
                body: intoFormData(data),
            }),
        }),
        startHappening: build.query<StartHappeningResponse, number>({
            query: (id) => `${PREFIX}/${id}/start`,
        }),
        endHappening: build.query<EndHappeningResponse, number>({
            query: (id) => `${PREFIX}/${id}/end`,
        }),
        deleteHappening: build.mutation<DeleteHappeningResponse, number>({
            query: (id) => ({
                url: `${PREFIX}/${id}/delete`,
                method: 'DELETE',
            }),
        }),
        setIsInterestedInHappening: build.mutation<
            SetIsInterestedInHappeningResponse,
            number
        >({
            query: (id) => ({
                url: `${PREFIX}/${id}/interested`,
                method: 'POST',
            }),
        }),
        getAllRuns: build.query<GetAllRunsResponse, void>({
            query: () => `${PREFIX}/runs`,
        }),
        getAllEvents: build.query<GetAllEventsResponse, void>({
            query: () => `${PREFIX}/events`,
        }),
        getHappeningInterestedPlayers: build.query<
            GetInterestedUsersResponse,
            number
        >({
            query: (id) => `${PREFIX}/${id}/interested`,
        }),
        updateIsPlayerInTeam: build.mutation<
            UpdateIsPlayerInTeamResponse,
            UpdateIsPlayerInTeamRequest
        >({
            query: ({ userId, happeningId }) => ({
                url: `${PREFIX}/${happeningId}/in-team/${userId}`,
                method: 'PUT',
            }),
        }),
        getReviews: build.query<GetReviewsResponse, number>({
            query: (happeningId) => `/${happeningId}/reviews`,
        }),
        createReview: build.mutation<CreateReviewResponse, CreateReviewRequest>(
            {
                query: ({ happeningId, userId, data }) => ({
                    url: `${PREFIX}/${happeningId}/reviews/${userId}`,
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
