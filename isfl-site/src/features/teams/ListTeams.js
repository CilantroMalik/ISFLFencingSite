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

}