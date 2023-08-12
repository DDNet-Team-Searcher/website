import { useGetAllRunsQuery } from '@/features/api/happenings.api';
import { useAppSelector } from '@/utils/hooks/hooks';
import { Run } from '@/components/Happening/Run';
import {
    deleteHappeningFromPopular,
    setIsInterestedInPopularHappening,
    setPopularHappeningStatus,
} from '@/store/slices/happenings';

export function Runs() {
    useGetAllRunsQuery();
    const runs = useAppSelector((state) => state.happenings.popular.runs);

    return (
        <>
            <div className="flex flex-wrap [&>*]:m-2.5">
                {runs.map((run) => (
                    <Run
                        run={run}
                        setStatusDispatch={setPopularHappeningStatus}
                        deleteDispatch={deleteHappeningFromPopular}
                        setIsInterestedDispatch={
                            setIsInterestedInPopularHappening
                        }
                    />
                ))}
            </div>
        </>
    );
}
