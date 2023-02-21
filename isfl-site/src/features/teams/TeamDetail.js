import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router";
import { nanoid } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { c } from "../../colors"
import { isMobile } from "react-device-detect";
import {Header} from "../header/Header";
import {setSeason} from "../season/seasonSlice";
import {useSearchParams} from "react-router-dom";

export const TeamDetail = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const season = useSelector(state => state.season.seasonInfo.currentSeason)
    const type = useSelector(state => state.season.seasonInfo.type)
    const theme = useSelector(state => state.theme.theme)

    const [searchParams, setSearchParams] = useSearchParams()
    const [detailData, setDetailData] = useState({
        "id": "000000000", "schoolName": "placeholder", "squadName": "placeholder",
        "wins": 0, "losses": 1, "boutsWon": 0, "boutsLost": 0, "touchesWon": 0, "touchesLost": 0,
        "fencers": {
            "placeholder": {
                "touchesWon": 0,
                "touchesLost": 0,
                "boutsWon": 0,
                "boutsLost": 1
            }
        }
    })

    if (searchParams.get("season")) {
        if (searchParams.get("season") !== season) {
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

    const [ranking, setRanking] = useState({})
    const [recentMeets, setRecentMeets] = useState([])

    const squadName = (team) => {
        const g = team.gender.charAt(0).toUpperCase() + team.gender.slice(1)
        const w = team.weapon.charAt(0).toUpperCase() + team.weapon.slice(1)
        return g + "' " + w
    }

    const fetchData = async () => {
        const team = location.state.team

        if (location.state.seasonType === "i") {
            const res = await fetch("https://api.isflfencing.com/fencers.php?season=" + season)
            const data = await res.json()
            console.log("done fencers")
            const internalRanking = handleFencers(data.queryResults)
            console.log(internalRanking)
            for (const k of Object.keys(internalRanking)) {
                team.fencers[k].rank = internalRanking[k]
            }
            await setRanking(handleFencers(data.queryResults, team.squadName))
            console.log("done state")
        }
        setDetailData(team)

        const res = await fetch("https://api.isflfencing.com/meets.php?season=" + season)
        const data = await res.json()
        console.log("done meets")
        console.log(data);
        setRecentMeets(handleMeets(team, data.queryResults, data.seasonType))
    }

    const fetchData2 = async () => {
        if (searchParams.get("id")) {
            const res = await fetch("https://api.isflfencing.com/teams.php?season=" + (searchParams.get("season") ? searchParams.get("season") : season))
            const data = await res.json()
            console.log("handling teams")
            console.log("looking for " + atob(searchParams.get("id")))
            let foundTeam = {}
            for (const t of data.queryResults) {
                if (atob(searchParams.get("id")) === t.school + "_" + squadName(t)) {
                    console.log("found match")
                    foundTeam = {schoolName: t.school, squadName: squadName(t), wins: t.matchesWon, losses: t.matchesLost,
                        boutsWon: t.boutsWon, boutsLost: t.boutsLost, touchesWon: t.touchesWon, touchesLost: t.touchesLost, fencers: t.fencers}
                    setDetailData({schoolName: t.school, squadName: squadName(t), wins: t.matchesWon, losses: t.matchesLost,
                        boutsWon: t.boutsWon, boutsLost: t.boutsLost, touchesWon: t.touchesWon, touchesLost: t.touchesLost, fencers: t.fencers})
                }
            }

            const res2 = await fetch("https://api.isflfencing.com/meets.php?season=" + (searchParams.get("season") ? searchParams.get("season") : season))
            const data2 = await res2.json()
            console.log(data2)
            await setRecentMeets(handleMeets(foundTeam, data2.queryResults, data2.seasonType))
            if (data.seasonType === "i") {
                const res = await fetch("https://api.isflfencing.com/fencers.php?season=" + (searchParams.get("season") ? searchParams.get("season") : season))
                const data = await res.json()
                await setRanking(handleFencers(data.queryResults, foundTeam.squadName))
            }
        }
    }

    useEffect(() => {
        console.log("effecting")
        if (!location.state) {
            fetchData2()
            // if (searchParams.get("id")) {
            //     fetch("https://api.isflfencing.com/teams.php?season=" + (searchParams.get("season") ? searchParams.get("season") : season))
            //         .then(response => response.json())
            //         .then(data => {
            //             console.log("handling teams")
            //             console.log("looking for " + atob(searchParams.get("id")))
            //             for (const t of data.queryResults) {
            //                 if (atob(searchParams.get("id")) === t.school + "_" + squadName(t)) {
            //                     console.log("found match")
            //                     setDetailData({schoolName: t.school, squadName: squadName(t), wins: t.matchesWon, losses: t.matchesLost,
            //                         boutsWon: t.boutsWon, boutsLost: t.boutsLost, touchesWon: t.touchesWon, touchesLost: t.touchesLost, fencers: t.fencers})
            //                 }
            //             }
            //         })
            //
            //     fetch("https://api.isflfencing.com/meets.php?season=" + (searchParams.get("season") ? searchParams.get("season") : season))
            //         .then(response => response.json())
            //         .then(data => {
            //             console.log(data)
            //             setRecentMeets(handleMeets(data.queryResults, data.seasonType))
            //             if (data.seasonType === "i") {
            //                 fetch("https://api.isflfencing.com/fencers.php?season=" + (searchParams.get("season") ? searchParams.get("season") : season))
            //                     .then(response => response.json())
            //                     .then(data => setRanking(handleFencers(data.queryResults)))
            //             }
            //         })
            // }
        } else {
            fetchData()
            // const team = location.state.team
            // setDetailData(team)
            //
            // if (location.state.seasonType === "i") {
            //     fetch("https://api.isflfencing.com/fencers.php?season=" + season)
            //         .then(response => response.json())
            //         .then(data => setRanking(handleFencers(data.queryResults)))
            // }
            //
            // fetch("https://api.isflfencing.com/meets.php?season=" + season)
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log(data);
            //         setRecentMeets(handleMeets(data.queryResults, data.seasonType))
            //     })
        }
    }, [])

    const getRank = (name) => {
        console.log("getting rank for " + name)
        console.log("--> current data: " + detailData.fencers[name].rank)
        return ranking[name]
    }

    const handleFencers = (apiRes, squad) => {
        const extracted = []
        for (const fencerName of Object.keys(apiRes)) {
            const fData = apiRes[fencerName]
            extracted.push({name: fencerName, school: fData.school, gender: fData.gender, weapon: fData.weapon, boutsWon: fData.boutsWon, boutsLost: fData.boutsLost, touchesWon: fData.touchesWon, touchesLost: fData.touchesLost})
        }
        const filtered = extracted.filter(fencer => genderWeapon(fencer.gender, fencer.weapon) === squad)
        const sorted = filtered.sort((f1, f2) => {
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
        console.log(sorted)
        let newRanking = {}
        let i = 1
        for (const f of sorted) {
            newRanking[f.name] = i
            i += 1
        }
        return newRanking
    }

    const handleMeets = (detailData, apiRes, seasonType) => {
        console.log("handling meets for", detailData.schoolName, detailData.squadName)
        let newRecentMeets = []
        for (const meet of apiRes) {
            for (const type of meet.types) {
                if (genderWeapon(type.gender, type.weapon) === detailData.squadName && (meet.hteam === detailData.schoolName || meet.ateam === detailData.schoolName)) {
                    if (seasonType === "i") {
                        let hBW = 0
                        let aBW = 0
                        for (const bout of type.bouts) {
                            if (bout.winner === "h") { hBW += 1 }
                            else {  aBW += 1 }
                        }
                        const meetResult = hBW > aBW ? (detailData.schoolName === meet.hteam ? "Won" : "Lost") : (hBW < aBW ? (detailData.schoolName === meet.hteam ? "Lost" : "Won") : "Tied")
                        newRecentMeets.push(meetResult + " vs. " + (detailData.schoolName === meet.ateam ? meet.hteam : meet.ateam) + " (" + (detailData.schoolName === meet.hteam ? hBW : aBW) + "-" + (detailData.schoolName === meet.hteam ? aBW : hBW) + ")")
                    } else {
                        const meetResult = type.hBW > type.aBW ? (detailData.schoolName === meet.hteam ? "Won" : "Lost") : (type.hBW < type.aBW ? (detailData.schoolName === meet.hteam ? "Lost" : "Won") : "Tied")
                        newRecentMeets.push(meetResult + " vs. " + (detailData.schoolName === meet.ateam ? meet.hteam : meet.ateam) + " (" + (detailData.schoolName === meet.hteam ? type.hBW : type.aBW) + "-" + (detailData.schoolName === meet.hteam ? type.aBW : type.hBW) + ")")
                    }
                }
            }
        }
        console.log(newRecentMeets)
        return newRecentMeets
    }

    const genderWeapon = (gen, wea) => {
        const g = gen.charAt(0).toUpperCase() + gen.slice(1)
        const w = wea.charAt(0).toUpperCase() + wea.slice(1)
        return g + "' " + w
    }

    const sortedFencerKeys = (fs) => {
        return Object.keys(fs).sort((n1, n2) => {
            const f1score = (fs[n1].boutsWon - fs[n1].boutsLost)*10000 + (fs[n1].boutsWon + fs[n1].boutsLost)*100 + (fs[n1].touchesWon - fs[n1].touchesLost)
            const f2score = (fs[n2].boutsWon - fs[n2].boutsLost)*10000 + (fs[n2].boutsWon + fs[n2].boutsLost)*100 + (fs[n2].touchesWon - fs[n2].touchesLost)
            // if ((fs[n1].boutsWon / (fs[n1].boutsLost + fs[n1].boutsWon)) < (fs[n2].boutsWon / (fs[n2].boutsLost + fs[n2].boutsWon))) { return 1 }
            // else if ((fs[n1].boutsWon / (fs[n1].boutsLost + fs[n1].boutsWon)) > (fs[n2].boutsWon / (fs[n2].boutsLost + fs[n2].boutsWon))) { return -1 }
            // else {
            //     if ((fs[n1].touchesWon - fs[n1].touchesLost) > (fs[n2].touchesWon - fs[n2].touchesLost)) { return -1 }
            //     else if ((fs[n1].touchesWon - fs[n1].touchesLost) < (fs[n2].touchesWon - fs[n2].touchesLost)) { return 1 }
            //     else { return 0 }
            // }
            if (f1score > f2score) { return -1 }
            else if (f1score < f2score) { return 1 }
            else { return 0 }
        })
    }

    return (
        <>
        <Header/>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1 style={{color: c[theme].text, textAlign: "center"}}>Team Details: {detailData.schoolName + " " + detailData.squadName}</h1>
            <h3 style={{color: c[theme].text}}>Record (wins-losses): <strong>{detailData.wins + "-" + detailData.losses}</strong></h3>
            <hr style={{width: "80%", borderColor: c[theme].text}}/>
            { (location.state ? location.state.seasonType : type) === "i" && <>
                <h2 style={{color: c[theme].text}}>—— Team Fencers ——</h2>
                {!isMobile && <table style={{width: "70%", color: c[theme].text}}><tbody>
                    <tr style={{fontSize: "1.4rem"}}>
                        <th style={{textAlign: "center"}}>Name</th>
                        <th style={{textAlign: "center"}}>League Ranking</th>
                        <th style={{textAlign: "center"}}>Bouts Won</th>
                        <th style={{textAlign: "center"}}>Bouts Lost</th>
                        <th style={{textAlign: "center"}}>Bout Win %</th>
                        <th style={{textAlign: "center"}}>Touches Scored</th>
                        <th style={{textAlign: "center"}}>Touches Received</th>
                        <th style={{textAlign: "center"}}>Touch Indicator</th>
                    </tr>
                    {sortedFencerKeys(detailData.fencers).map(name => (
                        <tr key={nanoid()} style={{fontSize: "1.2rem"}}>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{name}</strong></td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{getRank(name)}</strong></td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].boutsWon}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].boutsLost}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{Math.round(100 * detailData.fencers[name].boutsWon / (detailData.fencers[name].boutsWon + detailData.fencers[name].boutsLost))}%</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].touchesWon}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].touchesLost}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].touchesWon - detailData.fencers[name].touchesLost}</td>
                        </tr>
                    ))}
                </tbody></table>}</>}
        </div>
            {isMobile &&
                <table style={{width: "95%", color: c[theme].text}}><tbody>
                <tr style={{fontSize: isMobile ? "1rem" : "1.4rem"}}>
                    <th style={{textAlign: "center"}}>Name</th>
                    <th style={{textAlign: "center"}}>League Ranking</th>
                    <th style={{textAlign: "center"}}>Bouts Won</th>
                    <th style={{textAlign: "center"}}>Bouts Lost</th>
                    <th style={{textAlign: "center"}}>Bout Win %</th>
                    <th style={{textAlign: "center"}}>Touches Scored</th>
                    <th style={{textAlign: "center"}}>Touches Received</th>
                    <th style={{textAlign: "center"}}>Touch Indicator</th>
                </tr>
                {sortedFencerKeys(detailData.fencers).map(name => (
                    <tr key={nanoid()} style={{fontSize: isMobile ? "0.8rem" : "1.2rem"}}>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{name}</strong></td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}><strong>{ranking[name]}</strong></td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].boutsWon}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].boutsLost}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{Math.round(100 * detailData.fencers[name].boutsWon / (detailData.fencers[name].boutsWon + detailData.fencers[name].boutsLost))}%</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].touchesWon}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].touchesLost}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{detailData.fencers[name].touchesWon - detailData.fencers[name].touchesLost}</td>
                    </tr>
                ))}
                </tbody></table>
            }
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h2 style={{color: c[theme].text}}>—— Recent Match Results ——</h2>
            <div className="recentMatches">
            {recentMeets.map(m => <h5 key={nanoid()} style={{width: "100%", height: "100%", textAlign: "center", color: c[theme].text}}>{m}</h5>)}
            </div>
            <hr style={{width: "80%", borderColor: c[theme].text, marginBottom: "1.75rem"}}/>
            <button onClick={() => navigate("/teams", {state: {squadName: detailData.squadName}})}>Exit</button>
        </div>
        </>
    )

}