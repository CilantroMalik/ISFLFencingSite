import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router";
import { SquadDetail } from "../meets/SquadDetail";

export const MeetDetail = () => {
    const location = useLocation()
    const [weapon, setWeapon] = useState("None")
    const navigate = useNavigate()

    const meetData = {
        squads: ["Boys Foil", "Girls Foil"],
        squadData: {
            "Boys Foil": [{fencer1: "Placeholder 1", fencer2: "Placeholder 2", score1: 5, score2: 3}],
            "Girls Foil": [{fencer1: "Placeholder 3", fencer2: "Placeholder 4", score1: 4, score2: 5}],
        }
    }

    useEffect(() => {
        // fetch detailed meet data from API using location.state.id
    })

    const toggleWeapon = (w) => {
        if (weapon === w) { setWeapon("None") }
        else { setWeapon(w) }
    }

    const exit = () => {
        navigate("/")
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h2>Choose a weapon to view results:</h2>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <button style={{marginBottom: "1rem"}} onClick={() => toggleWeapon("Foil")} className={weapon === "Foil" ? "button" : "muted-button"}>Foil</button>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <button onClick={() => toggleWeapon("Epee")} className={weapon === "Epee" ? "button" : "muted-button"} style={{marginLeft: "3rem", marginRight: "3rem", marginBottom: "1rem"}}>Epee</button>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <button style={{marginBottom: "1rem"}} onClick={() => toggleWeapon("Saber")} className={weapon === "Saber" ? "button" : "muted-button"}>Saber</button>
                </div>
                <div style={{width: "2px", height: "5rem", marginLeft: "2rem", marginRight: "2rem", backgroundColor: "#f1f7ed", border: "1px solid #f1f7ed", borderRadius: "1px"}}> </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                    <button onClick={exit} style={{marginBottom: "1rem"}}>Exit</button>
                </div>
            </div>
        </div>
    )

}