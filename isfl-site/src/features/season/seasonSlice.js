import { createSlice } from "@reduxjs/toolkit";

const initialState = {seasonInfo: {currentSeason: "2223", type: "i", name: "2022-2023"}}

const seasonSlice = createSlice({
    name: "season",
    initialState,
    reducers: {
        setSeason(state, action) { state.seasonInfo = action.payload }
    }
})

export const { setSeason } = seasonSlice.actions

export default seasonSlice.reducer