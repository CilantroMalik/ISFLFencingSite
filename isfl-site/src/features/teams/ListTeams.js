import React, { useEffect, useState } from 'react'
import { Header } from "../header/Header";
import { useSelector } from "react-redux";
import {nanoid} from "@reduxjs/toolkit";
import { useNavigate, useLocation } from "react-router";
import { c } from "../../colors"
import "../../main.css"
import { isMobile } from "react-device-detect";

export const ListTeams = () => {
    const [weapon, setWeapon] = useState("None")
    const [gender, setGender] = useState("None")
    const season = useSelector(state => state.season.seasonInfo)
    const types = useSelector(state => state.types.typesInfo)
    const theme = useSelector(state => state.theme.theme)
    //const teams = [{id: "000000000", schoolName: "RCDS", squadName: "Boys Foil", wins: 5, losses: 4, boutsWon: 8, boutsLost: 6, touchesWon: 50, touchesLost: 35}]
    const [teams, setTeams] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const [tableSort, setTableSort] = useState("none")

    useEffect(() => {
        console.log("effect")
        if (location.state) {
            if (location.state.squadName) {
                console.log("setting from location")
                setGender(location.state.squadName.split("' ")[0])
                setWeapon(location.state.squadName.split("' ")[1])
            }
        }
        document.body.style.backgroundColor = c[theme].mainBG

        fetch("https://api.isflfencing.com/teams.php?season=" + season.currentSeason)
            .then(response => response.json())
            .then(data => setTeams(extractTeamData(data.queryResults)))
    }, [season])

    const toggleWeapon = (w) => {
        if (weapon === w) { setWeapon("None") }
        else { setWeapon(w) }
    }

    const squadName = (team) => {
        const g = team.gender.charAt(0).toUpperCase() + team.gender.slice(1)
        const w = team.weapon.charAt(0).toUpperCase() + team.weapon.slice(1)
        return g + "' " + w
    }

    const extractTeamData = (apiRes) => {
        const extracted = []
        for (const team of apiRes) {
            extracted.push({schoolName: team.school, squadName: squadName(team), wins: team.matchesWon, losses: team.matchesLost,
                boutsWon: team.boutsWon, boutsLost: team.boutsLost, touchesWon: team.touchesWon, touchesLost: team.touchesLost, fencers: team.fencers})
        }
        return extracted
    }

    const teamsForSquad = (squad) => {
        let squadTeams = []
        for (const team of teams) {
            if (team.squadName === squad) {
                squadTeams.push(team)
            }
        }
        let sorted = squadTeams.sort((team1, team2) => {
            if (!tableSort.startsWith("bi")) {
                if (Math.round(100 * team1.wins / (team1.wins + team1.losses)) > Math.round(100 * team2.wins / (team2.wins + team2.losses))) { return -1 }
                else if (Math.round(100 * team1.wins / (team1.wins + team1.losses)) < Math.round(100 * team2.wins / (team2.wins + team2.losses))) { return 1 }
                else {
                    if ((team1.boutsWon / (team1.boutsWon + team1.boutsLost)) > (team2.boutsWon / (team2.boutsWon + team2.boutsLost))) { return -1 }
                    else if ((team1.boutsWon / (team1.boutsWon + team1.boutsLost)) < (team2.boutsWon / (team2.boutsWon + team2.boutsLost))) { return 1 }
                    else {
                        if ((team1.touchesWon / (team1.touchesWon + team1.touchesLost)) > (team2.touchesWon / (team2.touchesWon + team2.touchesLost))) { return -1 }
                        else if ((team1.touchesWon / (team1.touchesWon + team1.touchesLost)) < (team2.touchesWon / (team2.touchesWon + team2.touchesLost))) { return 1 }
                        else { return 0 }
                    }
                }
            } else {
                if (team1.boutsWon - team1.boutsLost > team2.boutsWon - team2.boutsLost) { return -1 }
                else if (team1.boutsWon - team1.boutsLost < team2.boutsWon - team2.boutsLost) { return 1 }
                else { return 0 }
            }
        })
        if (tableSort === "wr-ltg" || tableSort === "bi-ltg") {
            return sorted.reverse()
        } else { return sorted }
    }

    const updateBoutIndicatorSort = () => {
        if (!tableSort.startsWith("bi")) { setTableSort("bi-gtl") }
        if (tableSort === "bi-gtl") { setTableSort("bi-ltg") }
        if (tableSort === "bi-ltg") { setTableSort("none") }
    }

    const updateWinRateSort = () => {
        if (!tableSort.startsWith("wr")) { setTableSort("wr-gtl") }
        if (tableSort === "wr-gtl") { setTableSort("wr-ltg") }
        if (tableSort === "wr-ltg") { setTableSort("none") }
    }

    return (
        <>
        <div className="hidePrint"><Header/></div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: c[theme].mainBG}}>
            <h1 className={theme + " hidePrint"}>Team List</h1>
            <h3 className={theme+ " hidePrint"}>Choose a gender and weapon to view teams:</h3>
            {
                isMobile ?
                    <>
                        <div style={{display: "flex", justifyContent: "center"}} className="hidePrint">
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                                <button style={gender === "Boys" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                        onClick={() => setGender("Boys")} className={gender === "Boys" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Boys</button>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                                <button style={gender === "Girls" ? {marginBottom: "1rem", marginLeft: "1.5rem"} : {marginBottom: "1rem", marginLeft: "1.5rem", color: c[theme].text}}
                                        onClick={() => setGender("Girls")} className={gender === "Girls" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Girls</button>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center"}} className="hidePrint">
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <button style={weapon === "Foil" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                        onClick={() => toggleWeapon("Foil")} className={weapon === "Foil" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Foil</button>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <button onClick={() => toggleWeapon("Epee")} className={weapon === "Epee" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}
                                        style={weapon === "Epee" ? {marginLeft: "1.5rem", marginRight: "1.5rem", marginBottom: "1rem"} : {marginLeft: "1.5rem", marginRight: "1.5rem", marginBottom: "1rem", color: c[theme].text}}>Epee</button>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <button style={weapon === "Sabre" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                        onClick={() => toggleWeapon("Sabre")} className={weapon === "Sabre" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Sabre</button>
                            </div>
                        </div>
                    </>
                :
                    <div style={{display: "flex", justifyContent: "center"}} className="hidePrint">
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <button style={gender === "Boys" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => setGender("Boys")} className={gender === "Boys" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Boys</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <button style={gender === "Girls" ? {marginBottom: "1rem", marginLeft: "3rem"} : {marginBottom: "1rem", marginLeft: "3rem", color: c[theme].text}}
                                    onClick={() => setGender("Girls")} className={gender === "Girls" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Girls</button>
                        </div>
                        <div style={{width: "2px", height: "5rem", marginLeft: "2rem", marginRight: "2rem", backgroundColor: c[theme].mainBG, border: "1px solid " + c[theme].text, borderRadius: "1px"}}> </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button style={weapon === "Foil" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => toggleWeapon("Foil")} className={weapon === "Foil" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Foil</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button onClick={() => toggleWeapon("Epee")} className={weapon === "Epee" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}
                                    style={weapon === "Epee" ? {marginLeft: "3rem", marginRight: "3rem", marginBottom: "1rem"} : {marginLeft: "3rem", marginRight: "3rem", marginBottom: "1rem", color: c[theme].text}}>Epee</button>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <button style={weapon === "Sabre" ? {marginBottom: "1rem"} : {marginBottom: "1rem", color: c[theme].text}}
                                    onClick={() => toggleWeapon("Sabre")} className={weapon === "Sabre" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Sabre</button>
                        </div>
                    </div>
            }
            {(weapon === "None" || gender === "None") &&
            <><h5 style={{textAlign: "center"}} className={theme}>Select a gender and weapon above to view teams.</h5></>
            }
            {((weapon !== "None" && gender !== "None") && !isMobile) &&
            <>
                <h2 className={theme}>Teams: {gender + "' " + weapon}</h2>
                <hr style={{width: "98%", borderColor: c[theme].text}}/>
                <table style={{width: "85%", color: c[theme].text}}><tbody>
                    <tr style={{fontSize: "1.1vw"}}>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Team</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Meets Won</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Meets Lost</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}} onClick={updateWinRateSort}>Meet Win % { !tableSort.startsWith("wr") ? "↕" : "" }{ tableSort === "wr-gtl" ? "↓" : "" }{ tableSort === "wr-ltg" ? "↑" : "" }</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Bouts Won</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Bouts Lost</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}} onClick={updateBoutIndicatorSort}>Bout Indicator { !tableSort.startsWith("bi") ? "↕" : "" }{ tableSort === "bi-gtl" ? "↓" : "" }{ tableSort === "bi-ltg" ? "↑" : "" }</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Touches Scored</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Touches Received</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Touch Indicator</th>
                    </tr>
                {teamsForSquad(gender + "' " + weapon).map(team => (
                    <tr className={theme === "dark" ? "meet-row" : "meet-row-light"} key={nanoid()} style={{fontSize: "0.9vw"}} onClick={() => navigate({pathname: "/teamDetail", search: "?id=" + btoa(team.schoolName + "_" + team.squadName) + "&season=" + season.currentSeason}, {state: {team: team, seasonType: season.type}})}>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{team.schoolName}</strong></td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{team.wins}</strong></td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{team.losses}</strong></td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{Math.round(100 * team.wins / (team.wins + team.losses))}%</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.boutsWon}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.boutsLost}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.boutsWon - team.boutsLost}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.touchesWon}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.touchesLost}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.touchesWon - team.touchesLost}</td>
                    </tr>
                ))}
                </tbody></table>
            </>
            }
            {((weapon !== "None" && gender !== "None") && isMobile) &&
                <>
                    <h2 className={theme}>Teams: {gender + "' " + weapon}</h2>
                    <hr style={{width: "98%", borderColor: c[theme].text}}/>
                </>
            }
        </div>
            {isMobile &&
        <table style={{width: "95%", color: c[theme].text}}><tbody>
        <tr style={{fontSize: "1rem"}}>
            <th style={{textAlign: "center", borderColor: c[theme].text}}>Team</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}}>Meets Won</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}}>Meets Lost</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}} onClick={updateWinRateSort}>Meet Win % { !tableSort.startsWith("wr") ? "↕" : "" }{ tableSort === "wr-gtl" ? "↓" : "" }{ tableSort === "wr-ltg" ? "↑" : "" }</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}}>Bouts Won</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}}>Bouts Lost</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}} onClick={updateBoutIndicatorSort}>Bout Indicator { !tableSort.startsWith("bi") ? "↕" : "" }{ tableSort === "bi-gtl" ? "↓" : "" }{ tableSort === "bi-ltg" ? "↑" : "" }</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}}>Touches Scored</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}}>Touches Received</th>
            <th style={{textAlign: "center", borderColor: c[theme].text}}>Touch Indicator</th>
        </tr>
        {teamsForSquad(gender + "' " + weapon).map(team => (
            <tr className={theme === "dark" ? "meet-row" : "meet-row-light"} key={nanoid()} style={{fontSize: "0.8rem"}} onClick={() => navigate({pathname: "/teamDetail", search: "?id=" + btoa(team.schoolName + "_" + team.squadName) + "&season=" + season.currentSeason}, {state: {team: team, seasonType: season.type}})}>
                <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{team.schoolName}</strong></td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{team.wins}</strong></td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{team.losses}</strong></td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}>{Math.round(100 * team.wins / (team.wins + team.losses))}%</td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.boutsWon}</td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.boutsLost}</td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.boutsWon - team.boutsLost}</td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.touchesWon}</td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.touchesLost}</td>
                <td style={{textAlign: "center", borderColor: c[theme].text}}>{team.touchesWon - team.touchesLost}</td>
            </tr>
        ))}
        </tbody></table>}
        </>
    )
}