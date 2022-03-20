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
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "2rem", marginBottom: "2rem"}}>
                <input type="text" placeholder="Search by name..." value={searchFencer} onChange={(e) => setSearchFencer(e.target.value)} style={{marginRight: "3rem", color: "antiquewhite"}}/>
                <input type="text" placeholder="Search by school..." value={searchSchool} onChange={(e) => setSearchSchool(e.target.value)} style={{marginRight: "3rem", color: "antiquewhite"}}/>
                <button onClick={clearClicked}>Clear</button>
            </div>
            {fencersSearch().length !== 0 &&
                <table style={{width: "60%"}}>
                    <tr style={{fontSize: "1.4rem"}}>
                        <th style={{textAlign: "center"}}>Name</th>
                        <th style={{textAlign: "center"}}>School</th>
                        <th style={{textAlign: "center"}}>Win Rate</th>
                        <th style={{textAlign: "center"}}>Bouts Won</th>
                        <th style={{textAlign: "center"}}>Bouts Lost</th>
                        <th style={{textAlign: "center"}}>Bout Win Indicator</th>
                        <th style={{textAlign: "center"}}>Touches Scored</th>
                        <th style={{textAlign: "center"}}>Touches Received</th>
                        <th style={{textAlign: "center"}}>Touch Indicator</th>
                    </tr>
                </table>
            }
        </div>
    )
}