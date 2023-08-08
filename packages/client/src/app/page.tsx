'use client';

import { useAppSelector } from '@/utils/hooks/hooks';
import dynamic from 'next/dynamic';

const Authed = dynamic(() => import('./Authed'));
const Guest = dynamic(() => import('./Guest'));

export default function Home() {
    const isAuthed = useAppSelector((state) => state.user.isAuthed);

    if (isAuthed === true) {
        return <Authed />;
    } else if (isAuthed === false) {
        return <Guest />;
    } else {
        // here can be fancy loader but just text is also enough
        return <p>Loading...</p>;
    }
}
