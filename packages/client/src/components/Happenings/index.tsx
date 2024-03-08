import { useGetHappeningsQuery } from '@/features/api/happenings.api';
import { Happening } from '@/components/Happening';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { mergeHappenings } from '@/store/slices/happenings';

export function Happenings() {
    const { data, isLoading, isSuccess } = useGetHappeningsQuery();
    const dispatch = useAppDispatch();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading && data && data.status === 'success' && isSuccess) {
            dispatch(mergeHappenings(data.data));
            setIsReady(true);
        }
    }, [data, isLoading, isSuccess]);

    return (
        <>
            {isReady &&
                data?.status === 'success' &&
                data.data.map(({ id }) => <Happening key={id} id={id} />)}
        </>
    );
}
