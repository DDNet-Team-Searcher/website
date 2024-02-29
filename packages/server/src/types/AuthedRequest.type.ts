import { Request } from 'express';

type Credentials = {
    user: {
        id: number;
    };
};

export type AuthedRequest = Request & Credentials;
export type OptionalAuthedRequest = Request & Partial<Credentials>;
