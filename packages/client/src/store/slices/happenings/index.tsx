import { Happening, Status } from '@app/shared/types/Happening.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type HappeningsState = {
    happenings: Happening[];
};

const initialState: HappeningsState = {
    happenings: [],
};

export const happeningsSlice = createSlice({
    name: 'happenings',
    initialState,
    reducers: {
        mergeHappenings(state, action: PayloadAction<Happening[]>) {
            for (let i = 0; i < action.payload.length; i++) {
                let replaced = false;

                for (let j = 0; j < state.happenings.length; j++) {
                    if (state.happenings[j].id === action.payload[i].id) {
                        state.happenings[j] = action.payload[i];
                        replaced = true;
                    }
                }

                if (!replaced) {
                    state.happenings.push(action.payload[i]);
                }
            }
        },
        setStatus(
            state,
            action: PayloadAction<{ id: number; status: Status }>,
        ) {
            let id = state.happenings.findIndex(
                (happening) => happening.id === action.payload.id,
            );

            state.happenings[id].status = action.payload.status;
        },
        setIsInterestedInHappening(
            state,
            action: PayloadAction<{ id: number; isInterested: boolean }>,
        ) {
            let id = state.happenings.findIndex(
                (happening) => happening.id === action.payload.id,
            );

            state.happenings[id].isInterested = action.payload.isInterested;
            state.happenings[id]._count.interestedPlayers += action.payload
                .isInterested
                ? 1
                : -1;
        },
        deleteHappening(state, action: PayloadAction<number>) {
            let id = state.happenings.findIndex(
                (happening) => happening.id === action.payload,
            );

            state.happenings.splice(id, 1);
        },
    },
});

export const {
    mergeHappenings,
    setStatus,
    setIsInterestedInHappening,
    deleteHappening,
} = happeningsSlice.actions;

export default happeningsSlice.reducer;
