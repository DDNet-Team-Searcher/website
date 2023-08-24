import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/store';

type Hint = {
    type: 'error' | 'success' | 'info';
    text: string;
};

type HintsState = {
    hints: Hint[];
};

const initialState: HintsState = {
    hints: [],
};

export const hintsSlice = createSlice({
    name: 'hints',
    initialState,
    reducers: {
        addHint(state, action: PayloadAction<Hint>) {
            state.hints.push(action.payload);
        },
        removeHint(state) {
            state.hints.splice(state.hints.length - 1, 1);
        },
    },
});

export const { addHint, removeHint } = hintsSlice.actions;

export const hint = (hint: Hint, duration = 5000) => {
    return async (dispatch: AppDispatch) => {
        dispatch(addHint(hint));

        setTimeout(() => {
            dispatch(removeHint());
        }, duration);
    };
};

export default hintsSlice.reducer;
