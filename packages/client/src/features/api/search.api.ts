import { SearchQueryRequest, SearchQueryResponse } from '@/types/api.type';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '.';

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: baseQuery('search'),
    endpoints: (build) => ({
        search: build.query<SearchQueryResponse, SearchQueryRequest>({
            query: ({ query, page }) => `?query=${encodeURIComponent(query)}&page=${page}`
        }),
    }),
});

export const { useLazySearchQuery } = searchApi;
