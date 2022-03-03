import React from 'react';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAllBoutsToSquad } from "./addMeetSlice";

export const SquadResults = (props) => {

    const dispatch = useDispatch()

    let fencers1 = ["", "", "", "", "", "", "", "", ""]
    let fencers2 = ["", "", "", "", "", "", "", "", ""]
    let scores1 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    let scores2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const handleSubmit = () => {
        let bouts = []
        for (let i = 0; i < 9; i++) {
            bouts.push({fencer1: fencers1[i], score1: scores1[i], fencer2: fencers2[i], score2: scores2[i]})
        }
        dispatch(addAllBoutsToSquad({squadName: props.squadName, bouts: bouts}))
        fencers1 = ["", "", "", "", "", "", "", "", ""]
        fencers2 = ["", "", "", "", "", "", "", "", ""]
        scores1 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        scores2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
}
