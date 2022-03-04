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

}
