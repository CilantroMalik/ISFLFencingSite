import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addAllBoutsToSquad } from "./addMeetSlice";
import { nanoid } from "@reduxjs/toolkit";
import { c } from "../../colors"
import { isMobile } from "react-device-detect";

export const SquadResults = (props) => {
    const addingMeet = useSelector(state => state.addMeet)
    const theme = useSelector(state => state.theme.theme)
    const dispatch = useDispatch()

    let fencers1 = ["", "", "", "", "", "", "", "", ""]
    let fencers2 = ["", "", "", "", "", "", "", "", ""]
    let scores1 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    let scores2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const handleSubmit = () => {
        let bouts = []
        for (let i = 0; i < 9; i++) {
            if (fencers1[i] !== "" && fencers2[i] !== "") { bouts.push({fencer1: fencers1[i], score1: scores1[i], fencer2: fencers2[i], score2: scores2[i]}) }
        }
        dispatch(addAllBoutsToSquad({squadName: props.squadName, bouts: bouts}))
        fencers1 = ["", "", "", "", "", "", "", "", ""]
        fencers2 = ["", "", "", "", "", "", "", "", ""]
        scores1 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        scores2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", opacity: addingMeet[props.squadName].length !== 0 ? "0.5" : "1"}}>
            <h3 style={{color: c[theme].text, marginBottom: "0.3rem"}}>{props.squadName}</h3>
            <hr style={{borderColor: c[theme].text, width: "90%", marginBottom: "1rem"}}/>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={nanoid()} style={{display: "flex", justifyContent: "center"}}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginRight: isMobile ? "0.7rem" : "1.5rem", width: isMobile ? "9%" : "12%",  marginBottom: "1rem"}}>
                        <select name="score1" id="score1" className="muted-button" style={{color: c[theme].text, borderColor: c[theme].text}} onChange={(e) => scores1[i] = parseInt(e.target.value)}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginRight: isMobile ? "0.7rem" : "1.5rem", width: isMobile ? "30%" : "35%"}}>
                        <input type="text" id="fencer1" name="fencer1" placeholder="Home Fencer" onChange={(e) => fencers1[i] = e.target.value} style={{color: c[theme].text, borderColor: c[theme].text}}/>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: isMobile ? "0.7rem" : "1.5rem", width: isMobile ? "30%" : "35%"}}>
                        <input type="text" id="fencer2" name="fencer2" placeholder="Away Fencer" onChange={(e) => fencers2[i] = e.target.value} style={{color: c[theme].text, borderColor: c[theme].text}}/>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: isMobile ? "0.7rem" : "1.5rem", width: isMobile ? "9%" : "12%"}}>
                        <select name="score2" id="score2" className="muted-button" style={{color: c[theme].text, borderColor: c[theme].text}} onChange={(e) => scores2[i] = parseInt(e.target.value)}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>
            ))}
            <br/>
            <button style={addingMeet[props.squadName].length !== 0 ? {marginBottom: "2rem", backgroundColor: "green", borderColor: "green"} : {marginBottom: "2rem"}} onClick={handleSubmit}>Save</button>
        </div>
    )
}
