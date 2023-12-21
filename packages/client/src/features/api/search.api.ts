import {
    SearchQueryRequest,
    SearchQueryResponse,
} from '@app/shared/types/api.type';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '.';

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: baseQuery('search'),
    endpoints: (build) => ({
        search: build.query<SearchQueryResponse, SearchQueryRequest>({
            query: ({ query, page, filters }) => {
                const filterString = new URLSearchParams(filters).toString();

                return `?query=${encodeURIComponent(
                    query,
                )}&page=${page}&${filterString}`;
            },
        }),
    }),
});

export const { useLazySearchQuery } = searchApi;
