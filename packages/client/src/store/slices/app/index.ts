import { Happenings } from '@/types/Happenings.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
    isCreateEventModalHidden: boolean;
    isCreateRunModalHidden: boolean;
    happeningInfoModal: {
        type: Happenings | null;
        happeningId: number | null;
        visible: boolean;
    };
};

const initialState: AppState = {
    isCreateEventModalHidden: true,
    isCreateRunModalHidden: true,
    happeningInfoModal: {
        type: null,
        happeningId: null,
        visible: false,
    },
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setIsCreateEventModalHidden(state, action: PayloadAction<boolean>) {
            state.isCreateEventModalHidden = action.payload;
        },
        setIsCreateRunModalHidden(state, action: PayloadAction<boolean>) {
            state.isCreateRunModalHidden = action.payload;
        },
        setHappeningInfoModalData(
            state,
            action: PayloadAction<{
                type: Happenings | null;
                happeningId: number | null;
                visible: boolean;
            }>,
        ) {
            state.happeningInfoModal.type = action.payload.type;
            state.happeningInfoModal.happeningId = action.payload.happeningId;
            state.happeningInfoModal.visible = action.payload.visible;
        },
    },
});

export const {
    setIsCreateEventModalHidden,
    setIsCreateRunModalHidden,
    setHappeningInfoModalData,
} = appSlice.actions;

export default appSlice.reducer;
