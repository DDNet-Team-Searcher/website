import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
    isCreateEventModalHidden: boolean;
    isCreateRunModalHidden: boolean;
    happeningInfoModal: {
        happeningId: number | null;
        visible: boolean;
    };
};

const initialState: AppState = {
    isCreateEventModalHidden: true,
    isCreateRunModalHidden: true,
    happeningInfoModal: {
        happeningId: null,
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
                happeningId: number | null;
                visible: boolean;
            }>,
        ) {
            state.happeningInfoModal.happeningId = action.payload.happeningId;
            state.happeningInfoModal.visible = action.payload.visible;
        },
    },
});

export const { setHappeningInfoModalData } = appSlice.actions;

export default appSlice.reducer;
