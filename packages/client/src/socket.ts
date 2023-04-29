import io from 'socket.io-client';

export const socket = io('localhost:8080', {
    withCredentials: true,
});
