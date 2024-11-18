// src/redux/reducers/webview.js
import { createSlice } from "@reduxjs/toolkit";

const INIT_STATE = {
    url: "https://www.google.com",
};

export const webviewSlice = createSlice({
    name: "webview",
    initialState: INIT_STATE,
    reducers: {
        setUrl: (state, action) => {
            state.url = action.payload;
        },
    },
});

export const { setUrl } = webviewSlice.actions;
export default webviewSlice.reducer;
