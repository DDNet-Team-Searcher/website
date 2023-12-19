import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = (url: string = '') =>
    fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_API_URL + '/api/' + url,
        credentials: 'include',
    });
