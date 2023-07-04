import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { AuthSocket } from 'src/types/AuthSocket.type';

const parseCookies = (cookieString: string): { [key: string]: string } => {
    const cookies = {};
    if (!cookieString) {
        return cookies;
    }

    const cookieList = cookieString.split(';');
    for (const cookie of cookieList) {
        const parts = cookie.split('=');
        const cookieName = parts[0].trim();
        const cookieValue = parts[1].trim();
        cookies[cookieName] = cookieValue;
    }

    return cookies;
};

export const WSAuthMiddleware = (jwtService: JwtService) => {
    return async (client: AuthSocket, next: NextFunction) => {
        try {
            const data: { id: number } = jwtService.verify(
                parseCookies(client.handshake.headers.cookie || "")?.token,
            );
            client.user = data;
            next();
        } catch (e) {
            next({
                name: 'Unauthorizaed',
                message: 'Unauthorizaed',
            });
        }
    };
};
