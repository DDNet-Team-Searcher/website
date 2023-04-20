import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { useRef, useState } from 'react';
import { Run as RunType, Status } from '@/types/Happenings.type';
import Link from 'next/link';
import { useOutsideClickHandler } from '@/utils/hooks/useClickedOutside';
import { HappeningStartTime } from '../HappeningStartTime';
import { HappeningPlace } from '../HappeningPlace';
import { Avatar } from '../Avatar';
import { hint } from '@/store/slices/hints';
import {
    useDeleteHappeningMutation,
    useLazyEndHappeningQuery,
    useSetIsInterestedInHappeningMutation,
    useLazyStartHappeningQuery,
} from '@/features/api/happenings.api';
import {
    deleteHappening,
    setHappeningStatus,
    setIsInterestedInHappening,
} from '@/store/slices/happenings';

type OwnProps = {
    run: RunType;
    onClick: (arg: number) => void;
    className?: string;
};

export const Run = ({ className, onClick, run }: OwnProps) => {
    const {
        description,
        id,
        mapName,
        place,
        startAt,
        status,
        teamSize,
        interestedPlayers: interested,
        author: { avatar, username, id: authorId },
        _count: { interestedPlayers },
    } = run;

    const dispatch = useAppDispatch();
    const [startRun] = useLazyStartHappeningQuery();
    const [endRun] = useLazyEndHappeningQuery();
    const [deleteRun] = useDeleteHappeningMutation();
    const [setIsUserInterestedInHappening] =
        useSetIsInterestedInHappeningMutation();
    const userId = useAppSelector((state) => state.user.user.id);
    const isOwner = authorId == userId;
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true);
    const ref = useRef<null | HTMLDivElement>(null);
    //     // const runs = useAppSelector(state => state.happeningsReducer.runs)
    const isUserInterestedInRun = !!interested.length;

    const handleOnClickOutside = () => {
        setIsShowMorePanelHidden(true);
    };

    useOutsideClickHandler(ref, !isShowMorePanelHidden, handleOnClickOutside);

    const endRunCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true);
            try {
                await endRun(id).unwrap();
                dispatch(
                    setHappeningStatus({
                        id,
                        type: 'run',
                        status: Status.Finished,
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        };
    };

    const deleteRunCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true);
            try {
                await deleteRun(id).unwrap();
                dispatch(deleteHappening({ type: 'run', id }));
            } catch (e) {
                console.log(e);
            }
        };
    };

    const startRunCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true);
            try {
                await startRun(id).unwrap();
                dispatch(
                    setHappeningStatus({
                        id,
                        type: 'run',
                        status: Status.Happening,
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        };
    };

    const setIsInterestedCb = (id: number) => {
        return async () => {
            try {
                setIsUserInterestedInHappening(id);
                dispatch(
                    setIsInterestedInHappening({
                        id,
                        isInterested: !!!interested.length,
                        type: 'run',
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        };
    };

    const editRunCb = () => {
        //TODO: MilkeeyCat from future add happening editing thing please ;DDD
        setIsShowMorePanelHidden(true);
        //         // dispatch(setIsEditHappeningModalHidden(false))
        //         // dispatch(setEditingHappeningId(id))
        //         // dispatch(setEditingHappeningType("run"))
    };

    return (
        <div
            className={classNames(
                'max-w-[255px] w-full bg-primary-2 rounded-[10px] flex flex-col hover:scale-[1.01] transition-all duration-150',
                { [className || '']: className },
            )}
        >
            <img
                src={`https://ddnet.org/ranks/maps/${mapName.replaceAll(
                    ' ',
                    '_',
                )}.png`}
                className="w-full max-h-[100px] object-cover rounded-t-[10px]"
                alt="map thumbnail"
            />
            <div className="p-2.5 flex flex-col grow-[1]">
                <div className="flex justify-between">
                    <HappeningStartTime startAt={startAt} status={status} />
                    <div
                        className={
                            'bg-primary-3 text-high-emphasis py-[3px] px-[7px] rounded-full flex items-center'
                        }
                    >
                        <img src="/run-people.svg" />
                        <span className="text-[12px] ml-1">
                            {interestedPlayers}
                        </span>
                    </div>
                </div>
                <HappeningPlace place={place} />
                <p
                    className="mt-4 text-high-emphasis font-semibold cursor-pointer"
                    onClick={() => onClick(id)}
                >
                    {mapName}
                </p>
                <p className="mt-1 text-medium-emphasis break-words">
                    {description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <Link href={`/profile/${authorId}`}>
                        <Avatar src={null} username={username} />
                    </Link>
                    <div className="flex">
                        <div className={'relative'}>
                            <button
                                className={'text-high-emphasis flex'}
                                onClick={() =>
                                    setIsShowMorePanelHidden(
                                        !isShowMorePanelHidden,
                                    )
                                }
                            >
                                ...
                            </button>
                            <div
                                data-hidden={isShowMorePanelHidden}
                                ref={ref}
                                className={classNames(
                                    {
                                        'absolute min-w-[200px] l-2.5 bg-[#15120D] flex flex-col rounded-[10px]':
                                            !isShowMorePanelHidden,
                                    },
                                    { hidden: isShowMorePanelHidden },
                                )}
                            >
                                {isOwner && status == Status.NotStarted && (
                                    <button
                                        className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1"
                                        onClick={startRunCb(id)}
                                    >
                                        Start Run
                                    </button>
                                )}
                                {isOwner && (
                                    <button
                                        className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1"
                                        onClick={editRunCb}
                                    >
                                        Edit Run
                                    </button>
                                )}
                                {isOwner && status == Status.Happening && (
                                    <button
                                        className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error"
                                        onClick={endRunCb(id)}
                                    >
                                        End Run
                                    </button>
                                )}
                                {isOwner && status != Status.Happening && (
                                    <button
                                        className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error"
                                        onClick={deleteRunCb(id)}
                                    >
                                        Delete Run
                                    </button>
                                )}
                            </div>
                        </div>
                        <button
                            className={classNames(
                                'py-1 px-2.5 bg-primary-3 text-high-emphasis rounded-[5px] flex items-center ml-2.5',
                                {
                                    'bg-[#383129] !text-primary-1':
                                        isUserInterestedInRun,
                                },
                            )}
                            onClick={setIsInterestedCb(id)}
                        >
                            <img
                                className="mr-2.5"
                                src={
                                    isUserInterestedInRun
                                        ? '/check-mark.png'
                                        : '/run-bell.svg'
                                }
                            />
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
