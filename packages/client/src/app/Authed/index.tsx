'use client';

import { Events } from '@/components/Events';
import { HappeningInfoModal } from '@/components/HappeningInfoModal';
import { Runs } from '@/components/Runs';
import { socket } from '@/socket';
import { setHappeningInfoModalData } from '@/store/slices/app';
import { addNotification } from '@/store/slices/user';
import { Notification } from '@/types/Notification.type';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { useEffect } from 'react';

export default function Authed() {
    const dispatch = useAppDispatch();
    const happeningInfoModalData = useAppSelector(
        (state) => state.app.happeningInfoModal,
    );

    const onClose = () => {
        dispatch(
            setHappeningInfoModalData({
                type: null,
                happeningId: null,
                visible: false,
            }),
        );
    };

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
        <div className="max-w-[1110px] mx-auto">
            <HappeningInfoModal
                happeningId={happeningInfoModalData.happeningId}
                onClose={onClose}
                type={happeningInfoModalData.type}
                visible={happeningInfoModalData.visible}
            />
            <Events />
            <Runs />
        </div>
    );
}
