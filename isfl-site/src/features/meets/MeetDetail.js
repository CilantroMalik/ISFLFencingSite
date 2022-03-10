import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router";
import { SquadDetail } from "../meets/SquadDetail";

export const MeetDetail = () => {
    const location = useLocation()
    const [weapon, setWeapon] = useState("None")
    const navigate = useNavigate()

    const meetData = {
        homeTeam: "RCDS",
        awayTeam: "Hackley",
        date: "02-26-2022",
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

    const overallMeetResults = () => {
        let homeSquadsWon = []
        let awaySquadsWon = []
        for (const squad of Object.keys(meetData.squadData)) {
            let homeBoutWins = 0
            let awayBoutWins = 0
            for (const bout of meetData.squadData[squad]) {
                if (bout.score1 > bout.score2) {
                    homeBoutWins += 1
                } else {
                    awayBoutWins += 1
                }
            }
            if (homeBoutWins > awayBoutWins) {
                homeSquadsWon.push(squad)
            } else {
                awaySquadsWon.push(squad)
            }
        }
        return (
            <div>
                <h5><strong>Home Team Squads Won:</strong> {homeSquadsWon.join(", ")}</h5>
                <h5><strong>Away Team Squads Won:</strong> {awaySquadsWon.join(", ")}</h5>
            </div>
        )
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>{meetData.homeTeam} (Home) vs {meetData.awayTeam} (Away): {meetData.date}</h1>
            <h3>Choose a weapon to view results:</h3>
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
            { weapon !== "None" &&
            <div style={{display: "flex", justifyContent: "center", width: "95%"}}>
                <SquadDetail squadName={"Boys " + weapon} squadData={meetData.squadData["Boys " + weapon]}/>
                <div style={{width: "10%"}}></div>
                <SquadDetail squadName={"Girls " + weapon} squadData={meetData.squadData["Girls " + weapon]}/>
            </div>
            }
            {weapon === "None" &&
            <>
                <h4>Overall Meet Results:</h4>
                <hr style={{width: "50%"}}/>
                {overallMeetResults()}
                <hr style={{width: "50%"}}/>
                <h5>Click a weapon at the top to view squad-specific breakdown.</h5>
            </>
            }
        </div>
    )

}