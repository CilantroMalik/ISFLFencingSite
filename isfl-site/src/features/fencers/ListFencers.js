import React, { useEffect, useState } from 'react';
import { Header } from "../header/Header";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { c } from "../../colors"

export const ListFencers = () => {
    const season = useSelector(state => state.season.seasonInfo.currentSeason)
    const [searchFencer, setSearchFencer] = useState("")
    const [searchSchool, setSearchSchool] = useState("")
    const theme = useSelector(state => state.theme.theme)

    const [fencers, setFencers] = useState([])

    useEffect(() => {
        fetch("https://api.isflfencing.com/fencers.php?season=" + season)
            .then(response => response.json())
            .then(data => setFencers(extractFencerData(data.queryResults)))
    }, [season])

    // const fencers = [{id: "0000000", name: "Rohan Malik", school: "RCDS", boutsWon: 0, boutsLost: 1, touchesWon: 3, touchesLost: 5}]

    const extractFencerData = (apiRes) => {
        const extracted = []
        for (const fencerName of Object.keys(apiRes)) {
            const fData = apiRes[fencerName]
            extracted.push({name: fencerName, school: fData.school, gender: fData.gender, weapon: fData.weapon, boutsWon: fData.boutsWon, boutsLost: fData.boutsLost, touchesWon: fData.touchesWon, touchesLost: fData.touchesLost})
        }
        return extracted
    }

    const genderWeapon = (fencer) => {
        const g = fencer.gender.charAt(0).toUpperCase() + fencer.gender.slice(1)
        const w = fencer.weapon.charAt(0).toUpperCase() + fencer.weapon.slice(1)
        return g + "' " + w
    }

    const containsName = (name) => {
        const names = name.split(" ")
        for (const n of names) {
            if (n.startsWith(searchFencer)) { return true }
        }
        return false
    }

    const fencersSearch = () => {
        let filtered = fencers
        if (searchFencer !== "") { filtered = fencers.filter(fencer => containsName(fencer.name)) }
        if (searchSchool !== "") { filtered = fencers.filter(fencer => fencer.school.startsWith(searchSchool)) }
        return filtered.sort((fencer1, fencer2) => {
            if ((fencer1.boutsWon - fencer1.boutsLost) > (fencer2.boutsWon - fencer2.boutsLost)) { return -1 }
            else if ((fencer1.boutsWon - fencer1.boutsLost) > (fencer2.boutsWon - fencer2.boutsLost)) { return 1 }
            else {
                if ((fencer1.touchesWon - fencer1.touchesLost) > (fencer2.touchesWon - fencer2.touchesLost)) { return -1 }
                else if ((fencer1.touchesWon - fencer1.touchesLost) > (fencer2.touchesWon - fencer2.touchesLost)) { return 1 }
                else { return 0 }
            }
        })
    }

    const clearClicked = () => {
        setSearchFencer("")
        setSearchSchool("")
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Header />
            <h1 className={theme}>Fencers</h1>
            <hr style={{width: "98%", borderColor: c[theme].text}}/>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "2rem", marginBottom: "2rem"}}>
                <input type="text" placeholder="Search by name..." value={searchFencer} onChange={(e) => setSearchFencer(e.target.value)}
                       style={{marginRight: "3rem", color: c[theme].text, borderColor: c[theme].text}}/>
                <input type="text" placeholder="Search by school..." value={searchSchool} onChange={(e) => setSearchSchool(e.target.value)}
                       style={{marginRight: "3rem", color: c[theme].text, borderColor: c[theme].text}}/>
                <button onClick={clearClicked}>Clear</button>
            </div>
            {fencersSearch().length !== 0 &&
                <table style={{width: "70%", color: c[theme].text}}><tbody>
                    <tr style={{fontSize: "1.2vw"}}>
                        <th style={{textAlign: "center"}}>Name</th>
                        <th style={{textAlign: "center"}}>School</th>
                        <th style={{textAlign: "center"}}>Gender/Weapon</th>
                        <th style={{textAlign: "center"}}>Win Rate</th>
                        <th style={{textAlign: "center"}}>Bouts Won</th>
                        <th style={{textAlign: "center"}}>Bouts Lost</th>
                        <th style={{textAlign: "center"}}>Bout Win Indicator</th>
                        <th style={{textAlign: "center"}}>Touches Scored</th>
                        <th style={{textAlign: "center"}}>Touches Received</th>
                        <th style={{textAlign: "center"}}>Touch Indicator</th>
                    </tr>
                    {fencersSearch().map(fencer => (
                        <tr key={nanoid()} style={{fontSize: "0.9vw"}}>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.name}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.school}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{genderWeapon(fencer)}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{Math.round(100*fencer.boutsWon / (fencer.boutsWon + fencer.boutsLost))}%</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.boutsWon}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.boutsLost}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.boutsWon - fencer.boutsLost}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.touchesWon}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.touchesLost}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.touchesWon - fencer.touchesLost}</td>
                        </tr>
                    ))}
                </tbody></table>
            }
            {fencersSearch().length === 0 && <h5 className={theme}>No fencers match your search criteria — maybe you made a typo?</h5> }
        </div>
    )
}