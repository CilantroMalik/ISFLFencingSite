import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router";
import { Header } from "../header/Header";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

export const ListMeets = () => {
    // const meets = [{"id": 1646142830, "season": "20212022", "hteam": "Avenues", "ateam": "St Anns", "date": "2022-02-10",
    //     "types": [
    //         {"id": "1646142830ebv", "weapon": "epee", "gender": "boys", "level": "varsity", "hBW": "7", "aBW": "2", "hTW": "32", "aTW": "21"},
    //         {"id": "1646142830fbv", "weapon": "foil", "gender": "boys", "level": "varsity", "hBW": "9", "aBW": "0", "hTW": "43", "aTW": "15"}
    //     ]
    // }]

    const [meets, setMeets] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        // fetch meet data from API
    })

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Header />
            <h1>Meets</h1>
            <hr style={{width: "98%"}}/>
            <table style={{width: "90%"}}>
                <tr style={{fontSize: "1.7rem"}}>
                    <th colSpan="3" style={{textAlign: "center"}}>Info</th>
                    <th colSpan="6" style={{textAlign: "center"}}>Scores (Bouts/Touches)</th>
                </tr>
                <tr style={{fontSize: "1.7rem"}}>
                    <th>Date</th>
                    <th>Home Team</th>
                    <th>Away Team</th>
                    <th>Score</th>
                </tr>
                {meets.map(meet => (
                    <tr style={{fontSize: "1.5rem"}} onClick={() => navigate("/meetDetail", {state: {id: meet.id}})}>
                        <td>{meet.date}</td>
                        <td>{meet.homeTeam}</td>
                        <td>{meet.awayTeam}</td>
                        <td>{meet.homeScore + "–" + meet.awayScore}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}