import { BellIcon } from '@/components/ui/Icons/Bell';
import { CheckMarkIcon } from '@/components/ui/Icons/CheckMark';
import { useSetIsInterestedInHappeningMutation } from '@/features/api/happenings.api';
import {
    setIsInterestedInPopularHappening,
    setIsInterestedInSearchResultHappening,
} from '@/store/slices/happenings';
import { setIsInterestedInHappening } from '@/store/slices/profile';
import { useAppDispatch } from '@/utils/hooks/hooks';
import classNames from 'classnames';

type OwnProps = {
    isUserInterestedInRun: boolean;
    runId: number;

    setIsInterestedDispatch:
        | typeof setIsInterestedInSearchResultHappening
        | typeof setIsInterestedInPopularHappening
        | typeof setIsInterestedInHappening;
};

export function InterestedButton({
    isUserInterestedInRun,
    runId,
    setIsInterestedDispatch,
}: OwnProps) {
    const dispatch = useAppDispatch();
    const [setIsUserInterestedInHappening] =
        useSetIsInterestedInHappeningMutation();

    const setIsInterested = async () => {
        try {
            await setIsUserInterestedInHappening(runId).unwrap();
            dispatch(
                setIsInterestedDispatch({
                    id: runId,
                    isInterested: !isUserInterestedInRun,
                    type: 'run',
                }),
            );
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <button
            className={classNames(
                'py-1 px-2.5 bg-primary-3 text-high-emphasis rounded-[5px] flex items-center ml-2.5',
                {
                    'bg-[#383129] !text-primary-1': isUserInterestedInRun,
                },
            )}
            onClick={setIsInterested}
        >
            {isUserInterestedInRun ? (
                <CheckMarkIcon
                    className="mr-2.5"
                    color="var(--app-primary-1)"
                />
            ) : (
                <BellIcon className="mr-2.5" color="var(--high-emphasis)" />
            )}
            Interested
        </button>
    );
}
