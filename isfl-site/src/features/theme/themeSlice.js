import { createSlice } from "@reduxjs/toolkit";
import { c } from "../../colors";

const initialState = {theme: "dark"}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme(state, action) { state.theme = action.payload; document.body.style.backgroundColor = c[action.payload].mainBG }
    }
})

export const { setTheme } = themeSlice.actions

export default themeSlice.reducer