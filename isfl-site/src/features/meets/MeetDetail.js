import React, { useEffect } from 'react'
import { useLocation } from "react-router";

export const MeetDetail = () => {
    const location = useLocation()

    const meetData = {}

    useEffect(() => {
        // fetch detailed meet data from API using location.state.id
    })

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>

        </div>
    )

}