import { createSlice } from "@reduxjs/toolkit";

const initialState = {currentSeason: "2021-2022"}

const seasonSlice = createSlice({
    name: "season",
    initialState,
    reducers: {
        setSeason(state, action) { state.currentSeason = action.payload }
    }
})

export const { setSeason } = seasonSlice.actions

export default seasonSlice.reducer