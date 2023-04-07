import { useGetAllRunsQuery } from '@/features/api/happenings.api';
import { setHappeningInfoModalData } from '@/store/slices/app';
import { Happenings } from '@/types/Happenings.type';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { Run } from '../Run';

export const Runs = () => {
    const dispatch = useAppDispatch();
    useGetAllRunsQuery();
    const runs = useAppSelector((state) => state.happenings.runs);

    const onClick = (runId: number) => {
        dispatch(setHappeningInfoModalData({
            type: Happenings.Run,
            happeningId: runId,
            visible: true
        }));
    };

    return (
        <>
            <div className="flex flex-wrap [&>*]:m-2.5">
                {runs.map((run) => (
                    <Run run={run} onClick={onClick} />
                ))}
            </div>
        </>
    );
};
