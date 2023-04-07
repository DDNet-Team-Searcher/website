import { Event, Happenings, Run, Status } from '@/types/Happenings.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type HappeningsState = {
    runs: Run[];
    events: Event[];
};

const initialState: HappeningsState = {
    runs: [],
    events: [],
};

export const happeningsSlice = createSlice({
    name: 'happenings',
    initialState,
    reducers: {
        setRuns(state, action: PayloadAction<Run[]>) {
            state.runs = action.payload;
        },
        setEvents(state, action: PayloadAction<Event[]>) {
            state.events = action.payload;
        },
        addHappening(
            state,
            action: PayloadAction<{
                type: Happenings;
                happening: Event | Run;
            }>,
        ) {
            if (action.payload.type === Happenings.Event) {
                state.events.push(action.payload.happening as Event);
            } else {
                state.runs.push(action.payload.happening as Run);
            }
        },
        setHappeningStatus(
            state,
            action: PayloadAction<{
                type: 'run' | 'event';
                id: number;
                status: Status;
            }>,
        ) {
            if (action.payload.type === 'event') {
                state.events = state.events.map((event) => {
                    if (event.id == action.payload.id) {
                        event.status = action.payload.status;
                    }

                    return event;
                });
            } else if (action.payload.type === 'run') {
                state.runs = state.runs.map((run) => {
                    if (run.id == action.payload.id) {
                        run.status = action.payload.status;
                    }

                    return run;
                });
            }
        },
        deleteHappening(
            state,
            action: PayloadAction<{ type: 'run' | 'event'; id: number }>,
        ) {
            if (action.payload.type === 'event') {
                state.events = state.events.filter(
                    (event) => event.id !== action.payload.id,
                );
            } else if (action.payload.type === 'run') {
                state.runs = state.runs.filter(
                    (run) => run.id !== action.payload.id,
                );
            }
        },
        setIsInterestedInHappening(
            state,
            action: PayloadAction<{
                type: 'run' | 'event';
                id: number;
                isInterested: boolean;
            }>,
        ) {
            if (action.payload.type === 'run') {
                const run = state.runs.filter(
                    (run) => run.id === action.payload.id,
                )[0];

                if (action.payload.isInterested) {
                    run.interestedPlayers.push({ inTeam: false });
                } else {
                    run.interestedPlayers.pop();
                }

                run._count.interestedPlayers =
                    run._count.interestedPlayers +
                    (action.payload.isInterested ? 1 : -1);
            } else if (action.payload.type === 'event') {
                const event = state.events.filter(
                    (event) => event.id === action.payload.id,
                )[0];

                if (action.payload.isInterested) {
                    event.interestedPlayers.push({ inTeam: false });
                } else {
                    event.interestedPlayers.pop();
                }

                event._count.interestedPlayers =
                    event._count.interestedPlayers +
                    (action.payload.isInterested ? 1 : -1);
            }
        },
    },
});

export const {
    setEvents,
    setRuns,
    addHappening,
    setHappeningStatus,
    deleteHappening,
    setIsInterestedInHappening,
} = happeningsSlice.actions;

export default happeningsSlice.reducer;
