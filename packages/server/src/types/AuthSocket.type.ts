import { Socket } from 'socket.io';

export type AuthSocket = Socket & {
    user: {
        id: number;
    };
};
