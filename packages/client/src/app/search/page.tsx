'use client';

import { Fragment } from 'react';
import { Event } from '@/components/Happening/Event';
import { useLazySearchQuery } from '@/features/api/search.api';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import { User } from './User';
import { SearchResultRun } from '@/components/Happening/Run/SearchResultRun';
import {
    deleteHappeningFromSearchResults,
    setIsInterestedInSearchResultHappening,
    setSearchResults,
    setSearchResultsHappeningStatus,
} from '@/store/slices/happenings';

export default function Search() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.user.user.id);
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
    const happenings = useAppSelector(
        (state) => state.happenings.searchResults,
    );
    const query = searchParams?.get('query') || '';

    useEffect(() => {
        setMoreResultsAvailable(false);
        if (query !== '') {
            searchQuery({ query, page })
                .unwrap()
                .then((res) => {
                    if (res.status === 'success') {
                        if (res.data.results.length) {
                            dispatch(setSearchResults(res.data.results));
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
                            setSearchResults([
                                ...happenings,
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
            {happenings.map((el) => (
                <Fragment key={el.id}>
                    {el.type == 'user' && (
                        <User authedUserId={userId} user={el} />
                    )}
                    {el.type == 'event' && (
                        <Event
                            className="!max-w-[100%]"
                            event={el}
                            setIsInterestedDispatch={
                                setIsInterestedInSearchResultHappening
                            }
                            deleteDispatch={deleteHappeningFromSearchResults}
                            setStatusDispatch={setSearchResultsHappeningStatus}
                        />
                    )}
                    {el.type == 'run' && (
                        <SearchResultRun
                            run={el}
                            setIsInterestedDispatch={
                                setIsInterestedInSearchResultHappening
                            }
                            deleteDispatch={deleteHappeningFromSearchResults}
                            setStatusDispatch={setSearchResultsHappeningStatus}
                        />
                    )}
                </Fragment>
            ))}
            <div ref={ref} />
        </div>
    );
}
