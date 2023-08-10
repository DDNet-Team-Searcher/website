'use client';

import { Avatar } from '@/components/Avatar';
import { Event } from '@/components/Event';
import { Button } from '@/components/ui/Button';
import { PeopleIcon } from '@/components/ui/Icons/People';
import { useLazySearchQuery } from '@/features/api/search.api';
import { useFollowUserMutation } from '@/features/api/users.api';
import { getUserFavoriteServer } from '@/store/slices/user';
import { SearchResult } from '@/types/SearchResult.type';
import { getTier } from '@/utils/getTier';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Event as EventT, Run as RunT, Status } from '@/types/Happenings.type';
import { HappeningPlace } from '@/components/HappeningPlace';
import { HappeningStartTime } from '@/components/HappeningStartTime';
import classNames from 'classnames';
import { useOutsideClickHandler } from '@/utils/hooks/useClickedOutside';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import { setEvents, setRuns } from '@/store/slices/happenings';

type RunProps = {
    run: RunT;
};

function Run({
    run: {
        id,
        mapName,
        place,
        startAt,
        status,
        description,
        interestedPlayers: interested,
        author: { id: authorId, username },
        _count: { interestedPlayers },
    },
}: RunProps) {
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true);
    const userId = useAppSelector((state) => state.user.user.id);
    const isOwner = authorId == userId;
    const ref = useRef(null);
    const isUserInterestedInRun = !!interested.length;

    const handleOnClickOutside = () => {
        setIsShowMorePanelHidden(true);
    };
    //FIXME: fun fact, none of this works. so u have to move this floating thing to a new component and use it here anf in @/components/Run/index.tsx
    //also it would be great to migrate to newer version of next
    //and would be great to not break everything

    useOutsideClickHandler(ref, !isShowMorePanelHidden, handleOnClickOutside);

    const startRunCb = (...args: any[]) => {
        return () => { };
    };
    const editRunCb = (...args: any[]) => {
        return () => { };
    };
    const deleteRunCb = (...args: any[]) => {
        return () => { };
    };
    const endRunCb = (...args: any[]) => {
        return () => { };
    };
    const setIsInterestedCb = (...args: any[]) => {
        return () => {
            alert('Doesnt work lmao');
        };
    };

    return (
        <div className="flex bg-primary-2 rounded-[10px]">
            <img
                src={`https://ddnet.org/ranks/maps/${mapName.replaceAll(
                    ' ',
                    '_',
                )}.png`}
                className="max-w-[256px] w-full object-cover rounded-l-[10px]"
                alt="map thumbnail"
            />
            <div className="grow px-5 py-4">
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
                <p className="mt-4 text-high-emphasis font-semibold cursor-pointer">
                    {mapName}
                </p>
                <p className="mt-1 text-medium-emphasis break-words">
                    {description}
                </p>
                <div className="flex items-center justify-between mt-4">
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
}

type UserProps = {
    authedUserId: number | null;
    user: {
        username: string;
        avatar: string | null;
        tier: number;
        id: number;
        verified: boolean;
        roles: {
            role: any[]; //FIXME: types...
        }[];
        _count: {
            followers: number;
            following: number;
        };
        isFollowing: boolean;
    };
};

function User({
    authedUserId,
    user: {
        username,
        tier,
        id,
        isFollowing: isFollowingIDK,
        _count: { followers },
    },
}: UserProps) {
    const dispatch = useAppDispatch();
    const tierName = getTier(tier);
    const [favoriteServer, setFavoriteServer] = useState<string>();
    const [followUser] = useFollowUserMutation();
    const [isFollowing, setIsFollowing] = useState(isFollowingIDK);

    useEffect(() => {
        dispatch(getUserFavoriteServer(username)).then((res) => {
            setFavoriteServer(res);
        });
    }, []);

    const onClick = async () => {
        await followUser(id).unwrap();
        setIsFollowing((prev) => !prev);
    };

    return (
        <div className="flex items-center bg-primary-2 rounded-[10px] px-5 py-2.5">
            <Avatar src={null} username={username} size={50} />
            <div className="ml-5">
                <Link
                    className="text-xl text-high-emphasis"
                    href={`/profile/${id}`}
                >
                    {username}
                </Link>
                <p className="flex items-center text-medium-emphasis text-xs">
                    <span>{tierName} tier</span>
                    <span className="mx-1 text-xl font-bold">∙</span>
                    <img
                        className="max-w-[30px]"
                        src={`https://ddnet.org/countryflags/${favoriteServer}.png`}
                    />
                    <span className="mx-1 text-xl font-bold">∙</span>
                    <span className="flex items-center">
                        <PeopleIcon
                            color="var(--medium-emphasis)"
                            className="max-w-[16px] mr-1"
                        />
                        {followers}
                    </span>
                </p>
            </div>
            {id != authedUserId && (
                <Button
                    className="ml-auto"
                    styleType="filled"
                    onClick={onClick}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
            )}
        </div>
    );
}

export default function Search() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.user.user.id);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [moreResultsAvailable, setMoreResultsAvailable] = useState(false);
    const [searchQuery] = useLazySearchQuery();
    const { ref, inView, entry } = useInView({
        threshold: 0,
        onChange: (inView) => {
            if (inView && moreResultsAvailable) {
                setPage((prev) => prev + 2);
            }
        },
    });

    const query = searchParams?.get('query') || '';

    useEffect(() => {
        console.log(query);
        // setPage(1);
        setMoreResultsAvailable(false);
        if (query !== '') {
            searchQuery({ query, page })
                .unwrap()
                .then((res) => {
                    if (res.status === 'success') {
                        if (res.data.results.length) {
                            setMoreResultsAvailable(res.data.next);
                            setSearchResults(res.data.results);

                            const runs: RunT[] = [];
                            const events: EventT[] = [];

                            for (const happening of res.data.results) {
                                if (happening.type == "run") {
                                    runs.push(happening);
                                } else if (happening.type == "event") {
                                    events.push(happening);
                                }
                            }

                            dispatch(setEvents(events));
                            dispatch(setRuns(runs));
                        } else {
                            // no results, show something
                        }
                    }
                });
        }
    }, [query]);

    useEffect(() => {
        if (query !== '' && page != 1) {
            searchQuery({ query, page })
                .unwrap()
                .then((res) => {
                    if (res.status === 'success') {
                        if (res.data.results.length) {
                            setMoreResultsAvailable(res.data.next);
                            setSearchResults((prev) => [
                                ...prev,
                                ...res.data.results,
                            ]);
                        } else {
                            // no results, show something
                        }
                    }
                });
        }
    }, [page]);

    return (
        <div className="max-w-[725px] mx-auto [&>*]:mt-7">
            {searchResults.map((el) => (
                <>
                    {el.type == 'user' && (
                        <User authedUserId={userId} user={el} />
                    )}
                    {el.type == 'event' && (
                        <Event
                            className="!max-w-[100%]"
                            event={el}
                            onClick={() => { }}
                        />
                    )}
                    {el.type == 'run' && <Run run={el} />}
                </>
            ))}
            <div ref={ref} />
        </div>
    );
}
