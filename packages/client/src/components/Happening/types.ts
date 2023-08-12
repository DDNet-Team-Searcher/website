import {
    deleteHappeningFromPopular,
    deleteHappeningFromSearchResults,
    setIsInterestedInPopularHappening,
    setIsInterestedInSearchResultHappening,
    setPopularHappeningStatus,
    setSearchResultsHappeningStatus,
} from '@/store/slices/happenings';
import {
    deleteHappening,
    setHappeningStatus,
    setIsInterestedInHappening,
} from '@/store/slices/profile';

export type BaseHappeningProps = {
    className?: string;
    setStatusDispatch:
    | typeof setPopularHappeningStatus
    | typeof setSearchResultsHappeningStatus
    | typeof setHappeningStatus;
    deleteDispatch:
    | typeof deleteHappeningFromPopular
    | typeof deleteHappeningFromSearchResults
    | typeof deleteHappening;

    setIsInterestedDispatch:
    | typeof setIsInterestedInPopularHappening
    | typeof setIsInterestedInSearchResultHappening
    | typeof setIsInterestedInHappening;
};
