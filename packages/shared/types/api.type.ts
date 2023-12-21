import type { Event, Run } from './Happening.type';
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

export type LogoutUserResponse = ApiResponse<null, null>;

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

export type UpdateHappening = ApiResponse<null, { [key: string]: string }>;

export type StartHappeningResponse = ApiResponse<
    { connectString: string | null },
    { reason: string }
>;

export type EndHappeningResponse = ApiResponse<null, null>;

export type DeleteHappeningResponse = ApiResponse<null, null>;

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

export type GetProfileResponse = ApiResponse<{ profile: Profile }, null>;

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
    filters: Record<string, string>;
};

export type SearchQueryResponse = ApiResponse<
    {
        results: SearchResult[];
        next: boolean;
    },
    SearchQueryRequest
>;

export type NotificationSeenResponse = ApiResponse<null, null>;

export type UpdateIsPlayerInTeamRequest = {
    userId: number;
    happeningId: number;
};

export type UpdateIsPlayerInTeamResponse = ApiResponse<
    null,
    UpdateIsPlayerInTeamRequest
>;

export type SetIsInterestedInHappeningResponse = ApiResponse<null, null>;

export type CreateReviewRequest = {
    happeningId: number;
    userId: number;
    data: {
        text: null | string;
        rate: number;
    };
};

export type CreateReviewResponse = ApiResponse<null, CreateReviewRequest>;

export type ReportUserRequest = {
    reason: string;
    userId: number;
};

export type ReportUserResponse = ApiResponse<null, { reason: string }>;

export type BanUserRequest = {
    reason: string;
    userId: number;
};

export type BanUserResponse = ApiResponse<null, { reason: string }>;
