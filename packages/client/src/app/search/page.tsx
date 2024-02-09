'use client';

import { useLazySearchQuery } from '@/features/api/search.api';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import { Happening } from '@/components/Happening';
import { SearchResult } from '@app/shared/types/SearchResult.type';
import { mergeHappenings } from '@/store/slices/happenings';
import { Happening as HappeningType } from '@app/shared/types/Happening.type';
import { User } from './User';
import { User as UserType } from '@app/shared/types/SearchResult.type';
import { useRouter } from 'next/navigation';

const selectOptions = {
    all: 'All',
    runs: 'Run',
    events: 'Event',
    users: 'User',
};

export default function Search() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({
        sort: searchParams.get('sort') || '',
    });
    const [moreResultsAvailable, setMoreResultsAvailable] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [searchQuery] = useLazySearchQuery();
    const { ref } = useInView({
        threshold: 0,
        onChange: (inView) => {
            if (inView && moreResultsAvailable) {
                setPage((prev) => prev + 2);
            }
        },
    });
    const [results, setResults] = useState<SearchResult[]>([]);
    const query = searchParams?.get('query') || '';

    useEffect(() => {
        setPage(1);
        setIsReady(false);
    }, [filters]);

    useEffect(() => {
        setMoreResultsAvailable(false);
        if (query !== '') {
            searchQuery({ query, page, filters })
                .unwrap()
                .then((res) => {
                    if (res.status === 'success') {
                        if (res.data.results.length) {
                            if (filters?.sort !== 'users') {
                                dispatch(
                                    mergeHappenings(
                                        res.data.results as HappeningType[],
                                    ),
                                );
                                setIsReady(true);
                            }

                            setResults(res.data.results);
                        } else {
                            // no results, show something
                        }
                    }
                });
        }
    }, [query, filters]);

    useEffect(() => {
        if (query !== '' && page != 1) {
            setIsReady(false);
            searchQuery({ query, page, filters })
                .unwrap()
                .then((res) => {
                    if (res.status === 'success') {
                        if (res.data.results.length) {
                            if (filters?.sort !== 'users') {
                                dispatch(
                                    mergeHappenings(
                                        res.data.results as HappeningType[],
                                    ),
                                );
                                setIsReady(true);
                            }

                            setMoreResultsAvailable(res.data.next);
                            setResults([...results, ...res.data.results]);
                        } else {
                            // no results, show something
                        }
                    }
                });
        }
    }, [page]);

    const setFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const filter = e.target.value as keyof typeof selectOptions;

        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set('sort', filter);
        router.push(`?${params.toString()}`);
        setFilters({
            ...filters,
            sort: filter,
        });
    };

    return (
        <div className="max-w-[1110px] w-full mx-auto">
            <div className="mt-5">
                <select
                    onChange={setFilter}
                    className="border-primary-3 border-[1px] px-3 py-2 bg-primary-2 rounded-[10px] text-high-emphasis"
                    defaultValue={filters['sort']}
                >
                    <option value="" disabled>
                        Type
                    </option>
                    {Object.keys(selectOptions).map((key, id) => (
                        <option key={id} value={key}>
                            {selectOptions[key as keyof typeof selectOptions]}
                        </option>
                    ))}
                </select>
            </div>
            {filters?.sort !== 'users' && isReady && (
                <div className="flex flex-wrap justify-between [&>*]:mt-7">
                    {results.map((happening) => (
                        <Happening id={happening.id} key={happening.id} />
                    ))}
                </div>
            )}
            {filters?.sort === 'users' &&
                results.length &&
                results[0].type === 'User' && (
                    <div className="max-w-[725px] w-full mx-auto [&>*]:mt-7">
                        {results.map((user) => {
                            return (
                                <User
                                    user={user as unknown as UserType}
                                    key={user.id}
                                />
                            );
                        })}
                    </div>
                )}
            <div ref={ref} />
        </div>
    );
}
