import { useGetAllRunsQuery } from '@/features/api/happenings.api';
import { useAppSelector } from '@/utils/hooks/hooks';
import { Run } from '../Run';

export function Runs() {
    useGetAllRunsQuery();
    const runs = useAppSelector((state) => state.happenings.runs);

    return (
        <>
            <div className="flex flex-wrap [&>*]:m-2.5">
                {runs.map((run) => (
                    <Run run={run} />
                ))}
            </div>
        </>
    );
}
