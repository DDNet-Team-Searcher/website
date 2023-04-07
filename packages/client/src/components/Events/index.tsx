import { useGetAllEventsQuery } from '@/features/api/happenings.api';
import { setHappeningInfoModalData } from '@/store/slices/app';
import { Happenings } from '@/types/Happenings.type';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { Event } from '../Event';

export const Events = () => {
    const dispatch = useAppDispatch();
    const events = useAppSelector((state) => state.happenings.events);
    useGetAllEventsQuery();

    const onClick = (runId: number) => {
        dispatch(setHappeningInfoModalData({
            type: Happenings.Event,
            happeningId: runId,
            visible: true
        }));
    };

    return (
        <>
            <div className="flex flex-wrap [&>*]:m-2.5">
                {events.map((run) => (
                    <Event event={run} onClick={onClick} />
                ))}
            </div>
        </>
    );
};
