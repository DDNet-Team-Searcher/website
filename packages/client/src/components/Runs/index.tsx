import { useGetAllRunsQuery } from '@/features/api/happenings.api';
import { Happening } from '@/components/Happening';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { mergeHappenings } from '@/store/slices/happenings';

export function Runs() {
    let { data, isLoading, isSuccess } = useGetAllRunsQuery();
    const dispatch = useAppDispatch();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading && data && data.status === 'success' && isSuccess) {
            dispatch(mergeHappenings(data.data.runs));
            setIsReady(true);
        }
    }, [data, isLoading, isSuccess]);

    return (
        <>
            {isReady &&
                data?.status === 'success' &&
                data.data.runs.map((run) => (
                    <Happening key={run.id} id={run.id} />
                ))}
        </>
    );
}
