import type { Event, Run } from './Happenings.type';
import type { Profile } from './Profile.type';
import type { Response as ApiResponse } from './Response.type';
import type { Review } from './Review.type';
import type { SearchResult } from './SearchResult.type';

export type RegisterUserRequest = {
    username: string;
    password: string;
    tier: number;
    email: string;
};

export type RegisterUserResponse = ApiResponse<null, RegisterUserRequest>;

export type LoginUserRequest = {
    email: string;
    password: string;
};

export type LoginUserResponse = ApiResponse<null, LoginUserRequest>;

export type CreateRunRequest = {
    mapName: string;
    teamSize: number;
    place: number;
    description: string | null;
    startAt: string;
};

export type CreateRunResponse = ApiResponse<
    { run: Run },
    Omit<CreateRunRequest, 'startAt'>
>;

export type CreateEventRequest = {
    mapName: string;
    title: string;
    startAt: string;
    place: number;
    endAt?: string | null;
    thumbnail?: File | null;
};

export type CreateEventResponse = ApiResponse<
    { event: Event },
    Omit<CreateEventRequest, 'startAt' | 'endAt'>
>;

export type StartHappeningResponse = ApiResponse<null, { reason: string }>;

export type GetAllRunsResponse = ApiResponse<{ runs: Run[] }, null>;

export type GetAllEventsResponse = ApiResponse<{ events: Event[] }, null>;

export type InterestedPlayer = {
    inTeam: boolean;
    user: {
        id: number;
        avatar: string | null;
        username: string;
    };
};

export type GetInterestedUsersResponse = ApiResponse<
    {
        interestedPlayers: InterestedPlayer[];
        _count: {
            InterestedPlayers: number;
        };
    },
    null
>;

export type GetReviewsResponse = ApiResponse<{ reviews: Review[] }, null>;

export type GetProfile = ApiResponse<{ profile: Profile }, null>;

export type UpdateAvatarResponse = ApiResponse<
    { avatar: string | null },
    { avatar: string }
>;

export type UpdateUsernameRequest = {
    password: string;
    username: string;
};

export type UpdateUsernameResponse = ApiResponse<null, UpdateUsernameRequest>;

export type UpdateEmailRequest = {
    password: string;
    email: string;
};

export type UpdateEmailRespone = ApiResponse<null, UpdateEmailRequest>;

export type UpdatePasswordRequest = {
    old: string;
    new: string;
};

export type UpdatePasswordResponse = ApiResponse<null, UpdatePasswordRequest>;

export type SearchQueryRequest = {
    query: string;
    page: number;
};

export type SearchQueryResponse = ApiResponse<
    {
        results: SearchResult[];
        next: boolean;
    },
    SearchQueryRequest
>;
