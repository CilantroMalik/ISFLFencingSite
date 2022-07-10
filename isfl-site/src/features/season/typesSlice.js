import { createSlice } from "@reduxjs/toolkit";

const initialState = {typesInfo: {

}}

const typesSlice = createSlice({
    name: "season",
    initialState,
    reducers: {
        setTypes(state, action) { state.typesInfo = action.payload }
    }
})

export const { setTypes } = typesSlice.actions

export default typesSlice.reducer