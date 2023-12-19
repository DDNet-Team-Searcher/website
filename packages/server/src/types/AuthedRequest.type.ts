import { Request } from 'express';

export type AuthedRequest = Request & {
    user: {
        id: number;
    };
};
