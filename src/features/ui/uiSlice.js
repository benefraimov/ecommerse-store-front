import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isCartPopupOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openCartPopup: (state) => {
            state.isCartPopupOpen = true;
        },
        closeCartPopup: (state) => {
            state.isCartPopupOpen = false;
        },
    },
});

export const { openCartPopup, closeCartPopup } = uiSlice.actions;
export default uiSlice.reducer;