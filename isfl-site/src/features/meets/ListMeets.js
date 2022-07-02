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
    const season = useSelector(state => state.season.currentSeason)

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
                    <th>Boys' Foil</th>
                    <th>Girls' Foil</th>
                    <th>Boys' Epee</th>
                    <th>Girls' Epee</th>
                    <th>Boys' Saber</th>
                    <th>Girls' Saber</th>
                </tr>
                {meets.map(meet => (
                    <tr key={nanoid()} style={{fontSize: "1.3rem"}} onClick={() => navigate("/meetDetail", {state: {id: meet.id}})}>
                        <td>{meet.date}</td>
                        <td>{meet.hteam}</td>
                        <td>{meet.ateam}</td>
                        <td>{hasType(meet, "boys", "foil") ? findType(meet, "boys", "foil") : "No results"}</td>
                        <td>{hasType(meet, "girls", "foil") ? findType(meet, "girls", "foil") : "No results"}</td>
                        <td>{hasType(meet, "boys", "epee") ? findType(meet, "boys", "epee") : "No results"}</td>
                        <td>{hasType(meet, "girls", "epee") ? findType(meet, "girls", "epee") : "No results"}</td>
                        <td>{hasType(meet, "boys", "saber") ? findType(meet, "boys", "saber") : "No results"}</td>
                        <td>{hasType(meet, "girls", "saber") ? findType(meet, "girls", "saber") : "No results"}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}