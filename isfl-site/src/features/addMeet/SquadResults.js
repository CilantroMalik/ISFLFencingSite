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

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h3 style={{color: "#f1f7ed"}}>{props.squadName}</h3>
            <hr style={{width: "90%"}}/>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div style={{display: "flex"}}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginRight: "1.5rem", width: "12%"}}>
                        <label htmlFor="score1">Score 1</label>
                        <select name="score1" id="score1" className="muted-button" onChange={(e) => scores1[i] = parseInt(e.target.value)}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginRight: "1.5rem", width: "35%"}}>
                        <label htmlFor="fencer1">Fencer 1</label>
                        <input type="text" id="fencer1" name="fencer1" onChange={(e) => fencers1[i] = e.target.value} style={{color: "#f1f7ed"}}/>
                    </div>
                </div>
            ))}
            <br/>
            <br/>
            <button onClick={handleSubmit}>Save</button>
        </div>
}
