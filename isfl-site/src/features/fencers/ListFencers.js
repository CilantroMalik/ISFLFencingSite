import React, { useEffect, useState } from 'react';
import { Header } from "../header/Header";

export const ListFencers = () => {
    const [searchFencer, setSearchFencer] = useState("")
    const [searchSchool, setSearchSchool] = useState("")

    useEffect(() => {
        // fetch data from API and update fencers
    })

    const fencers = [{id: "0000000", name: "Rohan Malik", school: "RCDS", boutsWon: 0, boutsLost: 1, touchesWon: 3, touchesLost: 5}]

    const containsName = (name) => {
        const names = name.split(" ")
        for (const n of names) {
            if (n.startsWith(searchFencer)) { return true }
        }
        return false
    }

    const fencersSearch = () => {
        return fencers.filter(fencer => containsName(fencer.name)).filter(fencer => fencer.school.startsWith(searchSchool))
    }

    const clearClicked = () => {
        setSearchFencer("")
        setSearchSchool("")
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Header />
            <h1>Fencers</h1>
            <hr style={{width: "98%"}}/>
        </div>
    )
}