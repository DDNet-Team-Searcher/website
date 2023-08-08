import { useGetAllEventsQuery } from '@/features/api/happenings.api';
import { useAppSelector } from '@/utils/hooks/hooks';
import { Event } from '../Event';

export function Events() {
    const events = useAppSelector((state) => state.happenings.events);
    useGetAllEventsQuery();

    return (
        <>
            <div className="flex flex-wrap [&>*]:m-2.5">
                {events.map((event) => (
                    <Event event={event} />
                ))}
            </div>
        </>
    );
}
