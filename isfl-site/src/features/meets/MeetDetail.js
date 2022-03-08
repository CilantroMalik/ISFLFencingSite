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

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>

        </div>
    )

}