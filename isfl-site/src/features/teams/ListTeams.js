import React, { useEffect, useState } from 'react'
import { Header } from "../header/Header";

export const ListTeams = () => {
    const [weapon, setWeapon] = useState("None")
    const [gender, setGender] = useState("Boys")
    const teams = [
        {id: "000000000", schoolName: "RCDS", squadName: "Boys Foil", wins: 5, losses: 4, boutsWon: 8, boutsLost: 6, touchesWon: 50, touchesLost: 35}
    ]

    useEffect(() => fetchTeams())

    const toggleWeapon = (w) => {
        if (weapon === w) { setWeapon("None") }
        else { setWeapon(w) }
    }

    const fetchTeams = () => {
        // Fetch team data from API and populate teams
    }

    const teamsForSquad = (squad) => {
        let squadTeams = []
        for (const team of teams) {
            if (team.squadName === squad) {
                squadTeams.push(team)
            }
        }
        return squadTeams
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Header />
            <h1>Team List</h1>
            <h3>Choose a weapon to view teams:</h3>
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
                    <button style={{marginBottom: "1rem"}} onClick={() => setGender("Boys")} className={gender === "Boys" ? "button" : "muted-button"}>Boys</button>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                    <button style={{marginBottom: "1rem", marginLeft: "3rem"}} onClick={() => setGender("Girls")} className={gender === "Girls" ? "button" : "muted-button"}>Girls</button>
                </div>
            </div>
            {weapon === "None" &&
            <><h5>Select a weapon above to view teams.</h5></>
            }
            {weapon !== "None" &&
            <>
                <h2>Teams: {gender + " " + weapon}</h2>
                <hr style={{width: "98%"}}/>
                <table style={{width: "75%"}}>
                    <tr>
                        <th style={{textAlign: "center"}}>Team</th>
                        <th style={{textAlign: "center"}}>Total Meets</th>
                        <th style={{textAlign: "center"}}>Wins</th>
                        <th style={{textAlign: "center"}}>Losses</th>
                        <th style={{textAlign: "center"}}>Win %</th>
                        <th style={{textAlign: "center"}}>Bouts Won</th>
                        <th style={{textAlign: "center"}}>Bouts Lost</th>
                        <th style={{textAlign: "center"}}>Bout Win Indicator</th>
                        <th style={{textAlign: "center"}}>Touches Scored</th>
                        <th style={{textAlign: "center"}}>Touches Received</th>
                        <th style={{textAlign: "center"}}>Touch Indicator</th>
                    </tr>
                {teamsForSquad(gender + " " + weapon).map(team => (
                    //<tr onClick={() => navigate("/teamDetail", {state: {id: meet.id}})}>
                    <tr>
                        <td style={{textAlign: "center"}}>{team.schoolName}</td>
                        <td style={{textAlign: "center"}}>{team.wins + team.losses}</td>
                        <td style={{textAlign: "center"}}>{team.wins}</td>
                        <td style={{textAlign: "center"}}>{team.losses}</td>
                        <td style={{textAlign: "center"}}>{Math.round(100 * team.wins / (team.wins + team.losses))}%</td>
                        <td style={{textAlign: "center"}}>{team.boutsWon}</td>
                        <td style={{textAlign: "center"}}>{team.boutsLost}</td>
                        <td style={{textAlign: "center"}}>{team.boutsWon - team.boutsLost}</td>
                        <td style={{textAlign: "center"}}>{team.touchesWon}</td>
                        <td style={{textAlign: "center"}}>{team.touchesLost}</td>
                        <td style={{textAlign: "center"}}>{team.touchesWon - team.touchesLost}</td>

                    </tr>
                ))}
                </table>
            </>
            }
        </div>
    )
}