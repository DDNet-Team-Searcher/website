import { Event, Run, Status } from '@app/shared/types/Happening.type';
import { SearchResult } from '@/types/SearchResult.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type HappeningsState = {
    popular: {
        runs: Run[];
        events: Event[];
    };
    searchResults: SearchResult[];
};

const initialState: HappeningsState = {
    popular: {
        runs: [],
        events: [],
    },
    searchResults: [],
};

export const happeningsSlice = createSlice({
    name: 'happenings',
    initialState,
    reducers: {
        setPopularRuns(state, action: PayloadAction<Run[]>) {
            state.popular.runs = action.payload;
        },
        setPopularEvents(state, action: PayloadAction<Event[]>) {
            state.popular.events = action.payload;
        },
        setSearchResults(state, action: PayloadAction<SearchResult[]>) {
            state.searchResults = action.payload;
        },

        setPopularHappeningStatus(
            state,
            action: PayloadAction<{
                id: number;
                type: 'run' | 'event';
                status: Status;
            }>,
        ) {
            const type = (action.payload.type + 's') as 'events' | 'runs';

            //@ts-ignore NOTE: idk how to write it in other way :p
            state.popular[type] = state.popular[type].map((happening) => {
                if (happening.id == action.payload.id) {
                    happening.status = action.payload.status;
                }

                return happening;
            });
        },
        setSearchResultsHappeningStatus(
            state,
            action: PayloadAction<{ id: number; status: Status }>,
        ) {
            state.searchResults = state.searchResults.map((result) => {
                if (result.type != 'user' && result.id == action.payload.id) {
                    result.status = action.payload.status;
                }

                return result;
            });
        },

        deleteHappeningFromSearchResults(
            state,
            action: PayloadAction<{ id: number }>,
        ) {
            state.searchResults = state.searchResults.filter(
                (happening) => happening.id !== action.payload.id,
            );
        },
        deleteHappeningFromPopular(
            state,
            action: PayloadAction<{ id: number; type: 'run' | 'event' }>,
        ) {
            const type = (action.payload.type + 's') as 'runs' | 'events';

            //@ts-ignore NOTE: idk how to write it in other way :p
            state.popular[type] = [...state.popular[type]].filter(
                (happening) => happening.id !== action.payload.id,
            );
        },

        setIsInterestedInSearchResultHappening(
            state,
            action: PayloadAction<{ id: number; isInterested: boolean }>,
        ) {
            const happening = state.searchResults.filter(
                (happening) => happening.id === action.payload.id,
            )[0] as Run | Event;

            happening.isInterested = action.payload.isInterested;

            happening._count.interestedPlayers =
                happening._count.interestedPlayers +
                (action.payload.isInterested ? 1 : -1);
        },
        setIsInterestedInPopularHappening(
            state,
            action: PayloadAction<{
                type: 'run' | 'event';
                id: number;
                isInterested: boolean;
            }>,
        ) {
            const type = (action.payload.type + 's') as 'runs' | 'events';
            const happening = [...state.popular[type]].filter(
                (happening) => happening.id === action.payload.id,
            )[0];

            happening.isInterested = action.payload.isInterested;

            happening._count.interestedPlayers =
                happening._count.interestedPlayers +
                (action.payload.isInterested ? 1 : -1);
        },
    },
});

export const {
    setPopularRuns,
    setPopularEvents,
    setSearchResults,

    setPopularHappeningStatus,
    setSearchResultsHappeningStatus,

    deleteHappeningFromPopular,
    deleteHappeningFromSearchResults,

    setIsInterestedInPopularHappening,
    setIsInterestedInSearchResultHappening,
} = happeningsSlice.actions;

export default happeningsSlice.reducer;
