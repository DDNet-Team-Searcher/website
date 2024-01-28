import { Event, Happenings, Run } from '@app/shared/types/Happening.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
    isCreateEventModalHidden: boolean;
    isCreateRunModalHidden: boolean;
    happeningInfoModal: {
        type: Happenings | null;
        happening: Run | Event | null;
        visible: boolean;
    };
};

const initialState: AppState = {
    isCreateEventModalHidden: true,
    isCreateRunModalHidden: true,
    happeningInfoModal: {
        type: null,
        happening: null,
        visible: false,
    },
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setHappeningInfoModalData(
            state,
            action: PayloadAction<{
                type: Happenings | null;
                happening: Run | Event | null;
                visible: boolean;
            }>,
        ) {
            state.happeningInfoModal.type = action.payload.type;
            state.happeningInfoModal.happening = action.payload.happening;
            state.happeningInfoModal.visible = action.payload.visible;
        },
    },
});

export const { setHappeningInfoModalData } = appSlice.actions;

export default appSlice.reducer;
