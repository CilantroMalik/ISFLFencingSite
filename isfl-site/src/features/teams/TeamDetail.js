import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router";
import { nanoid } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const TeamDetail = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const season = useSelector(state => state.season.seasonInfo.currentSeason)

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

    const [ranking, setRanking] = useState({"placeholder": 1})
    const [recentMeets, setRecentMeets] = useState([])

    useEffect(() => {
        console.log("effect")
        const team = location.state.team
        setDetailData(team)

        if (location.state.seasonType === "i") {
            fetch("https://api.isflfencing.com/fencers.php?season=" + season)
                .then(response => response.json())
                .then(data => setRanking(handleFencers(data.queryResults)))
        }

        fetch("https://api.isflfencing.com/meets.php?season=" + season)
            .then(response => response.json())
            .then(data => setRecentMeets(handleMeets(data.queryResults, data.seasonType)))
    }, [setDetailData, season, detailData])

    const handleFencers = (apiRes) => {
        const extracted = []
        for (const fencerName of Object.keys(apiRes)) {
            const fData = apiRes[fencerName]
            extracted.push({name: fencerName, school: fData.school, gender: fData.gender, weapon: fData.weapon, boutsWon: fData.boutsWon, boutsLost: fData.boutsLost, touchesWon: fData.touchesWon, touchesLost: fData.touchesLost})
        }
        const filtered = extracted.filter(fencer => genderWeapon(fencer.gender, fencer.weapon) === detailData.squadName)
        const sorted = filtered.sort((fencer1, fencer2) => {
            if ((fencer1.boutsWon - fencer1.boutsLost) > (fencer2.boutsWon - fencer2.boutsLost)) { return -1 }
            else if ((fencer1.boutsWon - fencer1.boutsLost) > (fencer2.boutsWon - fencer2.boutsLost)) { return 1 }
            else {
                if ((fencer1.touchesWon - fencer1.touchesLost) > (fencer2.touchesWon - fencer2.touchesLost)) { return -1 }
                else if ((fencer1.touchesWon - fencer1.touchesLost) > (fencer2.touchesWon - fencer2.touchesLost)) { return 1 }
                else { return 0 }
            }
        })
        let newRanking = {}
        let i = 1
        for (const f of sorted) {
            newRanking[f.name] = i
            i += 1
        }

        return newRanking
    }

    const handleMeets = (apiRes, seasonType) => {
        console.log("handling meets for", detailData.schoolName, detailData.squadName)
        let newRecentMeets = []
        for (const meet of apiRes) {
            for (const type of meet.types) {
                if (genderWeapon(type.gender, type.weapon) === detailData.squadName && meet.hteam === detailData.schoolName) {
                    if (seasonType === "i") {
                        let hBW = 0
                        let aBW = 0
                        for (const bout of type.bouts) {
                            if (bout.winner === "h") { hBW += 1 }
                            else {  aBW += 1 }
                        }
                        const meetResult = hBW > aBW ? "Won" : (hBW < aBW ? "Lost" : "Tied")
                        newRecentMeets.push(meetResult + " vs. " + meet.ateam + " (" + hBW + "-" + aBW + ")")
                    } else {
                        const meetResult = type.hBW > type.aBW ? "Won" : (type.hBW < type.aBW ? "Lost" : "Tied")
                        newRecentMeets.push(meetResult + " vs. " + meet.ateam + " (" + type.hBW + "-" + type.aBW + ")")
                    }
                }
            }
        }
        return newRecentMeets
    }

    const genderWeapon = (gen, wea) => {
        const g = gen.charAt(0).toUpperCase() + gen.slice(1)
        const w = wea.charAt(0).toUpperCase() + wea.slice(1)
        return g + "' " + w
    }

    const sortedFencerKeys = (fencers) => {
        return Object.keys(fencers).sort((name1, name2) => {
            if ((fencers[name1].boutsWon / (fencers[name1].boutsLost + fencers[name1].boutsWon)) > (fencers[name2].boutsWon / (fencers[name2].boutsLost + fencers[name2].boutsWon))) { return 1 }
            else if ((fencers[name1].boutsWon / (fencers[name1].boutsLost + fencers[name1].boutsWon)) < (fencers[name2].boutsWon / (fencers[name2].boutsLost + fencers[name2].boutsWon))) { return -1 }
            else {
                if ((fencers[name1].touchesWon - fencers[name1].touchesLost) > (fencers[name2].touchesWon - fencers[name2].touchesLost)) { return 1 }
                else if ((fencers[name1].touchesWon - fencers[name1].touchesLost) < (fencers[name2].touchesWon - fencers[name2].touchesLost)) { return -1 }
                else { return 0 }
            }
        })
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>Team Details: {detailData.schoolName + " " + detailData.squadName}</h1>
            <h3>Record (wins-losses): <strong>{detailData.wins + "-" + detailData.losses}</strong></h3>
            <hr style={{width: "80%"}}/>
            { location.state.seasonType === "i" && <>
                <h2>—— Team Fencers ——</h2>
                <table style={{width: "70%"}}><tbody>
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
                <td style={{textAlign: "center"}}><strong>{name}</strong></td>
                <td style={{textAlign: "center"}}><strong>{ranking[name]}</strong></td>
                <td style={{textAlign: "center"}}>{detailData.fencers[name].boutsWon}</td>
                <td style={{textAlign: "center"}}>{detailData.fencers[name].boutsLost}</td>
                <td style={{textAlign: "center"}}>{Math.round(100 * detailData.fencers[name].boutsWon / (detailData.fencers[name].boutsWon + detailData.fencers[name].boutsLost))}%</td>
                <td style={{textAlign: "center"}}>{detailData.fencers[name].touchesWon}</td>
                <td style={{textAlign: "center"}}>{detailData.fencers[name].touchesLost}</td>
                <td style={{textAlign: "center"}}>{detailData.fencers[name].touchesWon - detailData.fencers[name].touchesLost}</td>
                </tr>
                ))}
                </tbody></table></>}
            <h2>—— Recent Match Results ——</h2>
            <div className="recentMatches">
            {recentMeets.map(m => <h5 key={nanoid()} style={{width: "100%", height: "100%", textAlign: "center"}}>{m}</h5>)}
            </div>
            <hr style={{width: "80%"}}/>
            <button onClick={() => navigate("/teams", {state: {squadName: detailData.squadName}})}>Exit</button>
        </div>
    )

}