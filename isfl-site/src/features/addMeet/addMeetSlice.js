import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "Boys Foil": [],
    "Girls Foil": [],
    "Boys Epee": [],
    "Girls Epee": [],
    "Boys Saber": [],
    "Girls Saber": []
}

const addMeetSlice = createSlice({
    name: "season",
    initialState,
    reducers: {
        addAllBoutsToSquad(state, action) { state[action.payload.squadName] = action.payload.bouts },
        addBoutToSquad(state, action) { state[action.payload.squadName].push(action.payload.bout) }
    }
})

export const { addAllBoutsToSquad, addBoutToSquad } = addMeetSlice.actions

export default addMeetSlice.reducer