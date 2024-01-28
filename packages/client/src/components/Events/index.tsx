import { useGetAllEventsQuery } from '@/features/api/happenings.api';
import { Happening } from '@/components/Happening';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { mergeHappenings } from '@/store/slices/happenings';

export function Events() {
    let { data, isLoading, isSuccess } = useGetAllEventsQuery();
    const dispatch = useAppDispatch();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading && data && data.status === 'success' && isSuccess) {
            dispatch(mergeHappenings(data.data.events));
            setIsReady(true);
        }
    }, [data, isLoading, isSuccess]);

    return (
        <>
            {isReady &&
                data?.status === 'success' &&
                data.data.events.map((event) => (
                    <Happening key={event.id} id={event.id} />
                ))}
        </>
    );
}
