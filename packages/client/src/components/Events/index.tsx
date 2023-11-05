import { useGetAllEventsQuery } from '@/features/api/happenings.api';
import { useAppSelector } from '@/utils/hooks/hooks';
import { Event } from '@/components/Happening/Event';
import {
    deleteHappeningFromPopular,
    setIsInterestedInPopularHappening,
    setPopularHappeningStatus,
} from '@/store/slices/happenings';

export function Events() {
    useGetAllEventsQuery();
    const events = useAppSelector((state) => state.happenings.popular.events);

    return (
        <>
            <div className="flex flex-wrap [&>*]:m-2.5">
                {events.map((event) => (
                    <Event
                        key={event.id}
                        event={event}
                        setIsInterestedDispatch={
                            setIsInterestedInPopularHappening
                        }
                        deleteDispatch={deleteHappeningFromPopular}
                        setStatusDispatch={setPopularHappeningStatus}
                    />
                ))}
            </div>
        </>
    );
}
