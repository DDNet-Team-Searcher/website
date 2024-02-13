'use client';

import { Events } from '@/components/Events';
import { Runs } from '@/components/Runs';
import { socket } from '@/socket';
import { addNotification } from '@/store/slices/user';
import { Notification } from '@app/shared/types/Notification.type';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { useEffect } from 'react';

export default function Authed() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('connect_error', (data) => {
            console.log('Cant connect, the reason: ', data.message);
        });

        socket.on('notification', (notification: Notification) => {
            dispatch(addNotification(notification));
        });
    }, []);

    return (
        <div className="max-w-[1110px] mt-20 flex flex-wrap gap-7 w-full mx-auto">
            <Events />
            <Runs />
        </div>
    );
}
