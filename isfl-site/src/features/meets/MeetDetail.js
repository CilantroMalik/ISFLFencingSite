import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router";
import { SquadDetail } from "./SquadDetail";
import { useSelector, useDispatch } from "react-redux";
import { c } from "../../colors"
import { isMobile } from "react-device-detect";
import {Header} from "../header/Header";
import {useSearchParams} from "react-router-dom";
import {setSeason} from "../season/seasonSlice";

export const MeetDetail = () => {
    const location = useLocation()
    const [weapon, setWeapon] = useState("None")
    const theme = useSelector(state => state.theme.theme)
    const season = useSelector(state => state.season.seasonInfo)
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()

    if (searchParams.get("season")) {
        if (searchParams.get("season") !== season.currentSeason) {
            fetch("https://api.isflfencing.com/seasons.php")
                .then(response => response.json())
                .then(data => {
                    dispatch(setSeason({
                        currentSeason: searchParams.get("season"),
                        type: data[searchParams.get("season")].type === "team" ? "t" : "i",
                        name: data[searchParams.get("season")].name
                    }))
                })
        }
    }

    const [meetData, setMeetData] = useState({
        homeTeam: "RCDS",
        awayTeam: "Hackley",
        date: "02-26-2022",
        squads: ["Boys' Foil", "Girls' Foil"],
        squadData: {
            "Boys' Foil": [{fencer1: "Placeholder 1", fencer2: "Placeholder 2", score1: 5, score2: 3}],
            "Girls' Foil": [{fencer1: "Placeholder 3", fencer2: "Placeholder 4", score1: 4, score2: 5}],
        }
    })
    const navigate = useNavigate()

    useEffect(() => {
        console.log('effect')
        if (location.state === null) {
            if (searchParams.get("id")) {
                fetch("https://api.isflfencing.com/meets.php?season=" + (searchParams.get("season") ? searchParams.get("season") : season.currentSeason))
                    .then(response => response.json())
                    .then(data => {
                        let meet = {}
                        for (const m of data.queryResults) {
                            if (m.id === searchParams.get("id")) { meet = m; break }
                        }
                        let dat = {
                            homeTeam: meet.hteam,
                            awayTeam: meet.ateam,
                            date: meet.date,
                            squads: [],
                            squadData: {}
                        }
                        for (const type of meet.types) {
                            const gw = genderWeapon(type.gender, type.weapon)
                            dat.squads.push(gw)
                            let boutData = []
                            for (const bout of type.bouts) {
                                boutData.push({
                                    fencer1: bout.hfencer,
                                    fencer2: bout.afencer,
                                    score1: parseInt(bout.htouch),
                                    score2: parseInt(bout.atouch)
                                })
                            }
                            dat.squadData[gw] = boutData
                        }
                        setMeetData(dat)
                    })

            } else {
                navigate("/meets")
            }
        } else {
            const meet = location.state.meet
            let data = {
                homeTeam: meet.hteam,
                awayTeam: meet.ateam,
                date: meet.date,
                squads: [],
                squadData: {}
            }
            for (const type of meet.types) {
                const gw = genderWeapon(type.gender, type.weapon)
                data.squads.push(gw)
                let boutData = []
                for (const bout of type.bouts) {
                    boutData.push({
                        fencer1: bout.hfencer,
                        fencer2: bout.afencer,
                        score1: parseInt(bout.htouch),
                        score2: parseInt(bout.atouch)
                    })
                }
                data.squadData[gw] = boutData
            }
            setMeetData(data)
        }
    }, [setMeetData])

    const toggleWeapon = (w) => {
        if (weapon === w) { setWeapon("None") }
        else { setWeapon(w) }
    }

    const genderWeapon = (gen, wea) => {
        const g = gen.charAt(0).toUpperCase() + gen.slice(1)
        const w = wea.charAt(0).toUpperCase() + wea.slice(1)
        return g + "' " + w
    }

    const exit = () => {
        navigate("/meets")
    }

    const overallMeetResults = () => {
        let homeSquadsWon = []
        let awaySquadsWon = []
        for (const squad of Object.keys(meetData.squadData)) {
            let homeBoutWins = 0
            let awayBoutWins = 0
            for (const bout of meetData.squadData[squad]) {
                if (bout.score1 > bout.score2) {
                    homeBoutWins += 1
                } else {
                    awayBoutWins += 1
                }
            }
            if (homeBoutWins > awayBoutWins) {
                homeSquadsWon.push(squad)
            } else {
                awaySquadsWon.push(squad)
            }
        }
        return (
            <div style={{textAlign: "center"}}>
                <h5 style={{color: c[theme].text}}><strong>Home Team Squads Won:</strong> {homeSquadsWon.length === 0 ? "None" : homeSquadsWon.join(", ")}</h5>
                <h5 style={{color: c[theme].text}}><strong>Away Team Squads Won:</strong> {awaySquadsWon.length === 0 ? "None" : awaySquadsWon.join(", ")}</h5>
                <br/>
                {homeSquadsWon.length !== awaySquadsWon.length && <h5 style={{color: c[theme].text}}><strong>Meet Winner:</strong> {homeSquadsWon.length > awaySquadsWon.length ? meetData.homeTeam : meetData.awayTeam}</h5>}
                {homeSquadsWon.length === awaySquadsWon.length && <h5 style={{color: c[theme].text}}><strong>Meet Winner:</strong> Tie</h5>}
            </div>
        )
    }

    return (
        <><Header/>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div style={{display: "flex", flexDirection: "column"}}>
                <h1 style={{color: c[theme].text}}>{meetData.homeTeam} (Home) vs {meetData.awayTeam} (Away): {meetData.date}</h1>
                <hr style={{width: "100%", transform: "translate(0px, -20px)", borderColor: c[theme].text}}/>
            </div>
            <h3 style={{color: c[theme].text}}>Choose a weapon to view results:</h3>
            {isMobile ?
                <div style={{display: "flex", justifyContent: "center"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button style={{marginBottom: "1rem", color: weapon !== "Foil" ? c[theme].text : "#f1f7ed"}} onClick={() => toggleWeapon("Foil")} className={weapon === "Foil" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Foil</button>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button onClick={() => toggleWeapon("Epee")} className={weapon === "Epee" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")} style={{marginLeft: "1.5rem", marginRight: "1.5rem", marginBottom: "1rem", color: weapon !== "Epee" ? c[theme].text : "#f1f7ed"}}>Epee</button>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button style={{marginBottom: "1rem", color: weapon !== "Sabre" ? c[theme].text : "#f1f7ed"}} onClick={() => toggleWeapon("Sabre")} className={weapon === "Sabre" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Sabre</button>
                    </div>
                    <div style={{width: "2px", height: "5rem", marginLeft: "1.5rem", marginRight: "1.5rem", backgroundColor: c[theme].text, border: "1px solid "+c[theme].text, borderRadius: "1px"}}> </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                        <button onClick={exit} style={{marginBottom: "1rem"}}>Exit</button>
                    </div>
                </div>
                :
                <div style={{display: "flex", justifyContent: "center"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button style={{marginBottom: "1rem", color: weapon !== "Foil" ? c[theme].text : "#f1f7ed"}} onClick={() => toggleWeapon("Foil")} className={weapon === "Foil" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Foil</button>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button onClick={() => toggleWeapon("Epee")} className={weapon === "Epee" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")} style={{marginLeft: "3rem", marginRight: "3rem", marginBottom: "1rem", color: weapon !== "Epee" ? c[theme].text : "#f1f7ed"}}>Epee</button>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button style={{marginBottom: "1rem", color: weapon !== "Sabre" ? c[theme].text : "#f1f7ed"}} onClick={() => toggleWeapon("Sabre")} className={weapon === "Sabre" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Sabre</button>
                    </div>
                    <div style={{width: "2px", height: "5rem", marginLeft: "2rem", marginRight: "2rem", backgroundColor: c[theme].text, border: "1px solid "+c[theme].text, borderRadius: "1px"}}> </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                        <button onClick={exit} style={{marginBottom: "1rem"}}>Exit</button>
                    </div>
                </div>
            }
            { (weapon !== "None" && !isMobile) &&
            <div style={{display: "flex", justifyContent: "center", width: "98%"}}>
                <SquadDetail squadName={"Boys' " + weapon} squadData={meetData.squadData["Boys' " + weapon]}/>
                <div style={{width: isMobile ? "5%" : "10%"}}></div>
                <SquadDetail squadName={"Girls' " + weapon} squadData={meetData.squadData["Girls' " + weapon]}/>
            </div>
            }
            { (weapon !== "None" && isMobile) &&
                <>
                <SquadDetail squadName={"Boys' " + weapon} squadData={meetData.squadData["Boys' " + weapon]}/>
                <SquadDetail squadName={"Girls' " + weapon} squadData={meetData.squadData["Girls' " + weapon]}/>
                </>
            }
            {weapon === "None" &&
            <>
                <h4 style={{color: c[theme].text}}>Overall Meet Results:</h4>
                <hr style={{width: "50%", borderColor: c[theme].text}}/>
                {overallMeetResults()}
                <hr style={{width: "50%", borderColor: c[theme].text}}/>
                <h5 style={{color: c[theme].text, textAlign: "center"}}>Click a weapon at the top to view squad-specific breakdown.</h5>
            </>
            }
            <hr style={{width: "95%", borderColor: c[theme].text}}/>
            <h5 className={theme}>—— Admin Tools ——</h5>
            <a href={"https://old.isflfencing.com/editMeet.php?season=" + season.currentSeason + "&id=" + (location.state === null ? searchParams.get("id") : location.state.meet.id)}><button style={{marginBottom: "0.5rem"}}>Edit Meet</button></a>
            <a href={"https://old.isflfencing.com/deleteMeet.php?season=" + season.currentSeason + "&id=" + (location.state === null ? searchParams.get("id") : location.state.meet.id)}><button>Delete Meet</button></a>
        </div></>
    )

}