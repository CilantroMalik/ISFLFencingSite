import React from 'react'
import React, { useEffect } from 'react'
import { useNavigate } from "react-router";

export const ListMeets = () => {
    const meets = [{id: "0000000000", date: "02-26-2022", homeTeam: "RCDS", awayTeam: "Hackley", homeScore: "0", awayScore: "9"}]

    const navigate = useNavigate()

    useEffect(() => {
        // fetch meet data from API
    })

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>Meets</h1>
            <hr style={{width: "98%"}}/>
        </div>
    )
}