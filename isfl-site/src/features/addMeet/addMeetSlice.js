import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "homeTeam": "",
    "awayTeam": "",
    "date": "",
    "Boys' Foil": [],
    "Girls' Foil": [],
    "Boys' Epee": [],
    "Girls' Epee": [],
    "Boys' Sabre": [],
    "Girls' Sabre": []
}

const addMeetSlice = createSlice({
    name: "addMeet",
    initialState,
    reducers: {
        addAllBoutsToSquad(state, action) { state[action.payload.squadName] = action.payload.bouts },
        addHomeTeam(state, action) { state["homeTeam"] = action.payload },
        addAwayTeam(state, action) { state["awayTeam"] = action.payload },
        addDate(state, action) { state["date"] = action.payload },
        reset(state, action) {
            for (const k of Object.keys(state)) {
                if (Array.isArray(state[k])) { state[k] = [] }
                else { state[k] = "" }
            }
        }
    }
})

export const { addAllBoutsToSquad, addHomeTeam, addAwayTeam, addDate, reset } = addMeetSlice.actions

export default addMeetSlice.reducer