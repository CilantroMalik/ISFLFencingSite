import React, { useEffect, useState } from 'react';
import { Header } from "../header/Header";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { c } from "../../colors"
import { useNavigate } from "react-router";
import { isMobile } from 'react-device-detect'
import {createSearchParams} from "react-router-dom";

export const ListFencers = () => {
    const season = useSelector(state => state.season.seasonInfo.currentSeason)
    const [weapon, setWeapon] = useState("")
    const [gender, setGender] = useState("")
    const [searchFencer, setSearchFencer] = useState("")
    const [searchSchool, setSearchSchool] = useState("")
    const theme = useSelector(state => state.theme.theme)
    const navigate = useNavigate()

    const [fencers, setFencers] = useState([])
    const [percentMeets, setPercentMeets] = useState([])
    const [tableSort, setTableSort] = useState("none")

    let internalFencers = []

    useEffect(() => {
        fetch("https://api.isflfencing.com/fencers.php?season=" + season)
            .then(response => response.json())
            .then(data => {
                console.log("setting")
                setFencers(extractFencerData(data.queryResults))
                internalFencers = extractFencerData(data.queryResults)
                fetch("https://api.isflfencing.com/meets.php?season=" + season)
                    .then(response => response.json())
                    .then(data => {updateFencers(data.queryResults)})
            })
    }, [season])

    // const fencers = [{id: "0000000", name: "Rohan Malik", school: "RCDS", boutsWon: 0, boutsLost: 1, touchesWon: 3, touchesLost: 5}]

    const updateFencers = (apiRes) => {
        const newFencers = [...internalFencers]
        console.log(newFencers)
        for (const [i, fencer] of newFencers.entries()) {
            let totalMeets = 0
            let meetsFenced = 0
            for (const meet of apiRes) {
                if (meet.hteam !== fencer.school && meet.ateam !== fencer.school) { continue }
                for (const type of meet.types) {
                    if (genderWeapon(type) !== genderWeapon(fencer)) { continue }
                    totalMeets += 1
                    for (const bout of type.bouts) {
                        if (bout.hfencer === fencer.name || bout.afencer === fencer.name) {
                            meetsFenced += 1
                            break
                        }
                    }
                }
            }
            if (totalMeets === 0) {
                newFencers[i].percentOfMeets = "0%"
            } else {
                newFencers[i].percentOfMeets = (Math.round(100 * meetsFenced / totalMeets))+"%"
            }
        }
        let newPctMeets = []
        for (const fencer of newFencers) {
            newPctMeets.push({name: fencer.name, school: fencer.school, squad: genderWeapon(fencer), percentMeets: fencer.percentOfMeets})
        }
        setPercentMeets(newPctMeets)
    }

    const extractFencerData = (apiRes) => {
        const extracted = []
        for (const fencerName of Object.keys(apiRes)) {
            const fData = apiRes[fencerName]
            extracted.push({name: fencerName, school: fData.school, gender: fData.gender, weapon: fData.weapon, boutsWon: fData.boutsWon, boutsLost: fData.boutsLost, touchesWon: fData.touchesWon, touchesLost: fData.touchesLost, pctMeets: fData.percentOfMeetsFenced, pctBouts: fData.percentOfBoutsFenced})
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
            if (n.toLowerCase().startsWith(searchFencer.toLowerCase())) { return true }
        }
        return false
    }

    const fencersSearch = () => {
        let filtered = fencers
        if (searchFencer !== "") { filtered = filtered.filter(fencer => containsName(fencer.name)) }
        if (searchSchool !== "") { filtered = filtered.filter(fencer => fencer.school.toLowerCase().startsWith(searchSchool.toLowerCase())) }
        if (gender !== "") { filtered = filtered.filter(fencer => fencer.gender === gender.toLowerCase()) }
        if (weapon !== "") { filtered = filtered.filter(fencer => fencer.weapon === weapon.toLowerCase()) }
        if (tableSort === "none") {
            return filtered.sort((f1, f2) => {
                const f1Score = (f1.boutsWon - f1.boutsLost)*10000 + (f1.boutsWon + f1.boutsLost)*100 + (f1.touchesWon - f1.touchesLost)
                const f2Score = (f2.boutsWon - f2.boutsLost)*10000 + (f2.boutsWon + f2.boutsLost)*100 + (f2.touchesWon - f2.touchesLost)
                // if ((f1.boutsWon / (f1.boutsWon + f1.boutsLost)) > (f2.boutsWon / (f2.boutsWon + f2.boutsLost))) { return -1 }
                // else if ((f1.boutsWon / (f1.boutsWon + f1.boutsLost)) < (f2.boutsWon / (f2.boutsWon + f2.boutsLost))) { return 1 }
                // else {
                //     if ((f1.touchesWon - f1.touchesLost) > (f2.touchesWon - f2.touchesLost)) { return -1 }
                //     else if ((f1.touchesWon - f1.touchesLost) < (f2.touchesWon - f2.touchesLost)) { return 1 }
                //     else { return 0 }
                // }
                if (f1Score > f2Score) { return -1 }
                else if (f1Score < f2Score) { return 1 }
                else { return 0 }
            })
        } else {
            if (tableSort.startsWith("bi")) {
                const sortedFiltered = filtered.sort((f1, f2) => {
                    if ((f1.boutsWon - f1.boutsLost) > (f2.boutsWon - f2.boutsLost)) { return -1 }
                    else if ((f1.boutsWon- f1.boutsLost) < (f2.boutsWon - f2.boutsLost)) { return 1 }
                    else { return 0 }
                })
                if (tableSort === "bi-gtl") { return sortedFiltered }
                else { return sortedFiltered.reverse() }
            } else if (tableSort.startsWith("pm")) {
                const sortedFiltered = filtered.sort((f1, f2) => {
                    if (parseInt(getPctMeets(f1).replace("%", "")) > parseInt(getPctMeets(f2).replace("%", ""))) { return -1 }
                    else if (parseInt(getPctMeets(f1).replace("%", "")) < parseInt(getPctMeets(f2).replace("%", ""))) { return 1 }
                    else { return 0 }
                })
                if (tableSort === "pm-gtl") { return sortedFiltered }
                else { return sortedFiltered.reverse() }
            }
        }
    }

    const getPctMeets = (fencer) => {
        for (const dat of percentMeets) {
            if (dat.name === fencer.name && dat.school === fencer.school && dat.squad === genderWeapon(fencer)) { return dat.percentMeets }
        }
    }

    const clearClicked = () => {
        setSearchFencer("")
        setSearchSchool("")
    }

    const updateBoutIndicatorSort = () => {
        if (!tableSort.startsWith("bi")) { setTableSort("bi-gtl") }
        if (tableSort === "bi-gtl") { setTableSort("bi-ltg") }
        if (tableSort === "bi-ltg") { setTableSort("none") }
    }

    const updatePctMeetsSort = () => {
        if (!tableSort.startsWith("pm")) { setTableSort("pm-gtl") }
        if (tableSort === "pm-gtl") { setTableSort("pm-ltg") }
        if (tableSort === "pm-ltg") { setTableSort("none") }
    }

    const hexEncode = (str) => {
        let hex, i;

        let result = "";
        for (i=0; i<str.length; i++) {
            hex = str.charCodeAt(i).toString(16);
            result += ("000"+hex).slice(-4);
        }

        return result
    }

    const navigateFencer = (fencer) => {
        navigate({pathname: "/fencerDetail", search: `?${createSearchParams({
                id: hexEncode(fencer.name + "@" + fencer.school), season: season
            })}`}, {state: {fencer: fencer, pctMeets: getPctMeets(fencer)}})
    }

    return (
        <>
        <Header />
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1 style={{marginBottom: "1rem"}} className={theme}>Fencers</h1>
            <h5 style={{textAlign: "center"}} className={theme}>Click on a fencer to see a detailed breakdown of their bouts.</h5>
            <hr style={{width: "98%", borderColor: c[theme].text}}/>
            {
                isMobile ?
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "2rem"}}>
                        <input type="text" placeholder="Search by name..." value={searchFencer} onChange={(e) => setSearchFencer(e.target.value)}
                               style={{marginRight: "1.5rem", color: c[theme].text, borderColor: c[theme].text}}/>
                        <input type="text" placeholder="Search by school..." value={searchSchool} onChange={(e) => setSearchSchool(e.target.value)}
                               style={{marginRight: "1.5rem", color: c[theme].text, borderColor: c[theme].text}}/>
                        <button onClick={clearClicked}>Clear</button>
                    </div>
                :
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "2rem"}}>
                        <input type="text" placeholder="Search by name..." value={searchFencer} onChange={(e) => setSearchFencer(e.target.value)}
                               style={{marginRight: "3rem", color: c[theme].text, borderColor: c[theme].text}}/>
                        <input type="text" placeholder="Search by school..." value={searchSchool} onChange={(e) => setSearchSchool(e.target.value)}
                               style={{marginRight: "3rem", color: c[theme].text, borderColor: c[theme].text}}/>
                        <button onClick={clearClicked}>Clear</button>
                    </div>
            }
            <h5 className={theme}>Also, optionally, filter by gender and/or weapon:</h5>
            {
                isMobile ?
                    <>
                    <div style={{display: "flex", justifyContent: "center", marginBottom: "1rem"}}>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <button style={gender === "" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setGender("")} className={gender === "" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>All</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <button style={gender === "Boys" ? {marginBottom: "1rem", marginLeft: "1.5rem"} : {marginBottom: "1rem", marginLeft: "1.5rem", color: c[theme].text}}
                                    onClick={() => setGender("Boys")} className={gender === "Boys" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Boys</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <button style={gender === "Girls" ? {marginBottom: "1rem", marginLeft: "1.5rem"} : {marginBottom: "1rem", marginLeft: "1.5rem", color: c[theme].text}}
                                    onClick={() => setGender("Girls")} className={gender === "Girls" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Girls</button>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", marginBottom: "2rem"}}>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button style={weapon === "" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setWeapon("")} className={weapon === "" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>All</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button style={weapon === "Foil" ? {marginLeft: "1.5rem", marginBottom: "1rem"} : {marginLeft: "1.5rem", marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setWeapon("Foil")} className={weapon === "Foil" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Foil</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button onClick={() => setWeapon("Epee")} className={weapon === "Epee" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}
                                    style={weapon === "Epee" ? {marginLeft: "1.5rem", marginRight: "1.5rem", marginBottom: "1rem"} : {marginLeft: "1.5rem", marginRight: "1.5rem", marginBottom: "1rem", color: c[theme].text}}>Epee</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button style={weapon === "Sabre" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setWeapon("Sabre")} className={weapon === "Sabre" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Sabre</button>
                        </div>
                    </div>
                    </>
                :
                    <div style={{display: "flex", justifyContent: "center", marginBottom: "2rem"}}>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <button style={gender === "" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setGender("")} className={gender === "" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>All</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <button style={gender === "Boys" ? {marginBottom: "1rem", marginLeft: "3rem"} : {marginBottom: "1rem", marginLeft: "3rem", color: c[theme].text}}
                                    onClick={() => setGender("Boys")} className={gender === "Boys" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Boys</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <button style={gender === "Girls" ? {marginBottom: "1rem", marginLeft: "3rem"} : {marginBottom: "1rem", marginLeft: "3rem", color: c[theme].text}}
                                    onClick={() => setGender("Girls")} className={gender === "Girls" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Girls</button>
                        </div>
                        <div style={{width: "2px", height: "5rem", marginLeft: "2rem", marginRight: "2rem", backgroundColor: c[theme].mainBG, border: "1px solid " + c[theme].text, borderRadius: "1px"}}> </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button style={weapon === "" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setWeapon("")} className={weapon === "" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>All</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button style={weapon === "Foil" ? {marginLeft: "3rem", marginBottom: "1rem"} : {marginLeft: "3rem", marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setWeapon("Foil")} className={weapon === "Foil" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Foil</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button onClick={() => setWeapon("Epee")} className={weapon === "Epee" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}
                                    style={weapon === "Epee" ? {marginLeft: "3rem", marginRight: "3rem", marginBottom: "1rem"} : {marginLeft: "3rem", marginRight: "3rem", marginBottom: "1rem", color: c[theme].text}}>Epee</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button style={weapon === "Sabre" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setWeapon("Sabre")} className={weapon === "Sabre" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Sabre</button>
                        </div>
                    </div>
            }
            <p style={{textAlign: "center"}} className={theme}>Click on the <strong>Bout Indicator</strong> or <strong>% of Meets Fenced</strong> headers to sort by those metrics.</p>
            {!isMobile && fencersSearch().length !== 0 &&
                <table style={{width: "95%", color: c[theme].text}}><tbody>
                <tr style={{fontSize: isMobile ? "1rem" : "1.1vw"}}>
                    <th style={{textAlign: "center"}}>Rank</th>
                    <th style={{textAlign: "center"}}>Name</th>
                    <th style={{textAlign: "center"}}>School</th>
                    <th style={{textAlign: "center"}}>Gender/Weapon</th>
                    <th style={{textAlign: "center"}}>Win Rate</th>
                    <th style={{textAlign: "center"}}>Bouts Won</th>
                    <th style={{textAlign: "center"}}>Bouts Lost</th>
                    <th style={{textAlign: "center"}} onClick={updateBoutIndicatorSort}>Bout Indicator { !tableSort.startsWith("bi") ? "↕" : "" }{ tableSort === "bi-gtl" ? "↓" : "" }{ tableSort === "bi-ltg" ? "↑" : "" }</th>
                    <th style={{textAlign: "center"}}>Touches Scored</th>
                    <th style={{textAlign: "center"}}>Touches Received</th>
                    <th style={{textAlign: "center"}}>Touch Indicator</th>
                    <th style={{textAlign: "center"}} onClick={updatePctMeetsSort}>% of Meets Fenced { !tableSort.startsWith("pm") ? "↕" : "" }{ tableSort === "pm-gtl" ? "↓" : "" }{ tableSort === "pm-ltg" ? "↑" : "" }</th>
                    <th style={{textAlign: "center"}}>% of Bouts Fenced</th>
                </tr>
                {fencersSearch().map((fencer, i) => (
                    <tr className={theme === "dark" ? "meet-row" : "meet-row-light"} key={nanoid()} style={{fontSize: isMobile ? "0.8rem" : "0.9vw"}} onClick={() => navigateFencer(fencer)}>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{i+1}</td>
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
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{getPctMeets(fencer)}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.pctBouts}</td>
                    </tr>
                ))}
                </tbody></table>
            }
            {fencersSearch().length === 0 && <h5 style={{textAlign: "center"}} className={theme}>No fencers match your search criteria — maybe you made a typo?</h5> }
        </div>
        {(isMobile && fencersSearch().length !== 0) &&
            <table style={{width: "95%", color: c[theme].text}}><tbody>
            <tr style={{fontSize: isMobile ? "1rem" : "1.1vw"}}>
                <th style={{textAlign: "center"}}>Rank</th>
                <th style={{textAlign: "center"}}>Name</th>
                <th style={{textAlign: "center"}}>School</th>
                <th style={{textAlign: "center"}}>Gender/Weapon</th>
                <th style={{textAlign: "center"}}>Win Rate</th>
                <th style={{textAlign: "center"}}>Bouts Won</th>
                <th style={{textAlign: "center"}}>Bouts Lost</th>
                <th style={{textAlign: "center"}} onClick={updateBoutIndicatorSort}>Bout Indicator { !tableSort.startsWith("bi") ? "↕" : "" }{ tableSort === "bi-gtl" ? "↓" : "" }{ tableSort === "bi-ltg" ? "↑" : "" }</th>
                <th style={{textAlign: "center"}}>Touches Scored</th>
                <th style={{textAlign: "center"}}>Touches Received</th>
                <th style={{textAlign: "center"}}>Touch Indicator</th>
                <th style={{textAlign: "center"}} onClick={updatePctMeetsSort}>% of Meets Fenced { !tableSort.startsWith("pm") ? "↕" : "" }{ tableSort === "pm-gtl" ? "↓" : "" }{ tableSort === "pm-ltg" ? "↑" : "" }</th>
                <th style={{textAlign: "center"}}>% of Bouts Fenced</th>
            </tr>
            {fencersSearch().map((fencer, i) => (
                <tr className={theme === "dark" ? "meet-row" : "meet-row-light"} key={nanoid()} style={{fontSize: isMobile ? "0.8rem" : "0.9vw"}} onClick={() => navigateFencer(fencer)}>
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{i+1}</td>
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
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{getPctMeets(fencer)}</td>
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{fencer.pctBouts}</td>
                </tr>
            ))}
            </tbody></table>
        }
        </>
    )
}