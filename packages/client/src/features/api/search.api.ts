import {
    SearchQueryRequest,
    SearchQueryResponse,
} from '@app/shared/types/api.type';
import { baseApi } from './base.api';

export const searchApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        search: build.query<SearchQueryResponse, SearchQueryRequest>({
            query: ({ query, page, filters }) => {
                const filterString = new URLSearchParams(filters).toString();

                return `/search?query=${encodeURIComponent(
                    query,
                )}&page=${page}&${filterString}`;
            },
        }),
    }),
});

export const { useLazySearchQuery } = searchApi;
