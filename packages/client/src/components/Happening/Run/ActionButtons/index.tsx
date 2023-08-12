import { ActionButtons as HappeningActionButtons } from '../../ActionButtons';
import {
    useDeleteHappeningMutation,
    useLazyEndHappeningQuery,
    useLazyStartHappeningQuery,
} from '@/features/api/happenings.api';
import { hint } from '@/store/slices/hints';
import { Status } from '@/types/Happenings.type';
import { ExcludeSuccess } from '@/types/Response.type';
import { StartHappeningResponse } from '@/types/api.type';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { RunProps } from '../types';

type OwnProps = {
    runId: number;
    authorId: number;
    status: Status;
} & Pick<RunProps, 'setStatusDispatch' | 'deleteDispatch'>;

export function ActionButtons({
    runId,
    authorId,
    status,
    setStatusDispatch,
    deleteDispatch,
}: OwnProps) {
    const dispatch = useAppDispatch();
    const [startRunQuery] = useLazyStartHappeningQuery();
    const [endRunQuery] = useLazyEndHappeningQuery();
    const [deleteRunQuery] = useDeleteHappeningMutation();

    const endRun = async (id: number) => {
        try {
            await endRunQuery(id).unwrap();
            dispatch(
                setStatusDispatch({
                    id,
                    type: 'run',
                    status: Status.Finished,
                }),
            );
        } catch (e) {
            console.log(e);
        }
    };

    const deleteRun = async (id: number) => {
        try {
            await deleteRunQuery(id).unwrap();
            //NOTE: i have to pass either  {id: number, type: string } or just {id: number } but i can pass both and type just wont be used
            dispatch(deleteDispatch({ id, type: 'run' }));
        } catch (e) {
            console.log(e);
        }
    };

    const startRun = async (id: number) => {
        try {
            await startRunQuery(id).unwrap();
            dispatch(
                setStatusDispatch({
                    id,
                    type: 'run',
                    status: Status.Happening,
                }),
            );
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<StartHappeningResponse>;

            if (
                error.status === 'fail' &&
                error.data.reason == 'NO_EMPTY_SERVERS'
            ) {
                dispatch(
                    hint({
                        type: 'error',
                        text: error.message!,
                    }),
                );
            }

            console.log(err);
        }
    };

    const editRun = () => {
        //TODO: MilkeeyCat from future add happening editing thing please ;DDD
        alert('Nuh uh');
    };

    return (
        <HappeningActionButtons
            happeningId={runId}
            startHappening={startRun}
            authorId={authorId}
            editHappening={editRun}
            endHappening={endRun}
            deleteHappening={deleteRun}
            status={status}
        />
    );
}
