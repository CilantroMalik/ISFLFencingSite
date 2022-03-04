import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { SquadResults } from "./SquadResults";

export const AddMeet = () => {

    const addedMeet = useSelector(state => state.addMeet)
    const [weapon, setWeapon] = useState("None")
    const navigate = useNavigate()

    const toggleWeapon = (w) => {
        if (weapon === w) { setWeapon("None") }
        else { setWeapon(w) }
    }

    const threeSquads = () => {
        let fullSquads = 0
        for (let bouts of Object.values(addedMeet)) {
            if (bouts.length !== 0) {
                fullSquads += 1
            }
        }
        return fullSquads >= 3
    }

    const squadsAdded = () => {
        let squads = []
        console.log(Object.keys(addedMeet))
        for (let squadName of Object.keys(addedMeet)) {
            console.log(addedMeet[squadName])
            if (addedMeet[squadName].length !== 0) {
                squads.push(squadName)
            }
        }
        return squads
    }

    const isFilled = (squadName) => {
        console.log("Squad Name: " + squadName)
        console.log(addedMeet[squadName])
        console.log(addedMeet[squadName].length !== 0)
        return (addedMeet[squadName].length !== 0 ? "green" : "#f1f7ed")
    }

    const finish = () => {
        // make API call with addedMeet state
        navigate("/")
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        </div>
    )

}
