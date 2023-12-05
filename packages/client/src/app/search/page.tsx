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

const selectOptions = {
    'all': 'All',
    'run': 'Run',
    'event': 'Event',
    'user': 'User'
};

export default function Search() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.user.user.id);
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
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
        setPage(1);
    }, [filters]);

    useEffect(() => {
        setMoreResultsAvailable(false);
        if (query !== '') {
            searchQuery({ query, page, filters })
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
    }, [query, filters]);

    useEffect(() => {
        if (query !== '' && page != 1) {
            searchQuery({ query, page, filters })
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

    const setFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const filter = e.target.value as keyof typeof selectOptions;

        setFilters({
            ...filters,
            sort: filter
        });
    }

    return (
        <div className="max-w-[725px] w-full mx-auto">
            <div className="mt-5">
                <select onChange={setFilter} className="border-primary-3 border-[1px] px-3 py-2 bg-primary-2 rounded-[10px] text-high-emphasis">
                    <option value="" disabled>Type</option>
                    {Object.keys(selectOptions).map((key, id) => (
                        <option key={id} value={key}>{selectOptions[key as keyof typeof selectOptions]}</option>
                    ))}
                </select>
            </div>
            <div className="[&>*]:mt-7">
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
        </div >
    );
}
