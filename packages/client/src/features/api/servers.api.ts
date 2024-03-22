import { ServerResponse, ServersResponse } from '@app/shared/types/api.type';
import { baseApi } from './base.api';

const PREFIX = '/servers';

export const serversApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getServers: build.query<ServersResponse, void>({
            query: () => PREFIX,
        }),
        getServer: build.query<ServerResponse, number>({
            query: (id) => `${PREFIX}/${id}`,
        }),
    }),
});

export const { useGetServersQuery, useGetServerQuery } = serversApi;
