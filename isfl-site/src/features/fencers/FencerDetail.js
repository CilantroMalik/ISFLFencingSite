import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router";
import { nanoid } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { c } from "../../colors"
import {Header} from "../header/Header";
import { isMobile } from "react-device-detect";
import {useSearchParams} from "react-router-dom";
import { setSeason } from "../season/seasonSlice";
import {setTypes} from "../season/typesSlice";

export const FencerDetail = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const season = useSelector(state => state.season.seasonInfo.currentSeason)
    const types = useSelector(state => state.types.typesInfo)
    const theme = useSelector(state => state.theme.theme)
    const [searchParams, setSearchParams] = useSearchParams()
    let masterFencer = {}
    if (location.state) {
        masterFencer = location.state.fencer
        console.log(masterFencer)
    }
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

    const [detailData, setDetailData] = useState({
        "name": "placeholder", "school": "placeholder", "squadName": "placeholder"
    })

    const [bouts, setBouts] = useState([])
    const [fencerData, setFencerData] = useState({})

    const genderWeapon = (fencer) => {
        const g = fencer.gender.charAt(0).toUpperCase() + fencer.gender.slice(1)
        const w = fencer.weapon.charAt(0).toUpperCase() + fencer.weapon.slice(1)
        return g + "' " + w
    }

    const handleMeets = (meets) => {
        const squadName = genderWeapon(masterFencer)
        for (const meet of meets) {
            if (meet.hteam !== masterFencer.school && meet.ateam !== masterFencer.school) { continue }
            for (const type of meet.types) {
                if (genderWeapon(type) !== squadName) { continue }
                for (const bout of type.bouts) {
                    if (bout.hfencer !== masterFencer.name && bout.afencer !== masterFencer.name) { continue }
                    bouts.push({opponentName: bout.hfencer === masterFencer.name ? bout.afencer : bout.hfencer, opponentSchool: meet.hteam === masterFencer.school ? meet.ateam : meet.hteam,
                        touchesWon: bout.hfencer === masterFencer.name ? bout.htouch : bout.atouch, touchesLost: bout.hfencer === masterFencer.name ? bout.atouch : bout.htouch, date: meet.date})
                }
            }
        }
        return bouts
    }

    const boutsCompare = (bout1, bout2) => {
        if (Date.parse(bout1.date) > Date.parse(bout2.date)) { return -1 }
        else if (Date.parse(bout1.date) < Date.parse(bout2.date)) { return 1 }
        else { return 0 }
    }

    const sortedBouts = () => {
        const boutsSorted = bouts.sort(boutsCompare)
        console.log("sorted bouts")
        console.log(boutsSorted)
        return boutsSorted
    }

    const extractFencerData = (apiRes) => {
        const extracted = []
        for (const fencerName of Object.keys(apiRes)) {
            const fData = apiRes[fencerName]
            extracted.push({name: fencerName, school: fData.school, gender: fData.gender, weapon: fData.weapon, boutsWon: fData.boutsWon, boutsLost: fData.boutsLost, touchesWon: fData.touchesWon, touchesLost: fData.touchesLost, pctMeets: fData.percentOfMeetsFenced, pctBouts: fData.percentOfBoutsFenced})
        }
        return extracted
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

    const hexDecode = (str) => {
        let j;
        let hexes = str.match(/.{1,4}/g) || [];
        let back = "";
        for(j = 0; j<hexes.length; j++) {
            back += String.fromCharCode(parseInt(hexes[j], 16));
        }

        return back;
    }

    const fetchData = async () => {
        if (searchParams.get("id")) {
            console.log("found id in URL")
            const res = await fetch("https://api.isflfencing.com/fencers.php?season=" + (searchParams.get("season") ? searchParams.get("season") : season))
            const data = await res.json()
            const allFencers = extractFencerData(data.queryResults)
            for (const f of allFencers) {
                if (hexDecode(searchParams.get("id")) === f.name + "@" + f.school) {
                    const meetRes = await fetch("https://api.isflfencing.com/meets.php?season=" + season)
                    const meetData = await meetRes.json()
                    let totalMeets = 0
                    let meetsFenced = 0
                    let finalPct = ""
                    for (const meet of meetData.queryResults) {
                        if (meet.hteam !== f.school && meet.ateam !== f.school) { continue }
                        for (const type of meet.types) {
                            if (genderWeapon(type) !== genderWeapon(f)) { continue }
                            totalMeets += 1
                            for (const bout of type.bouts) {
                                if (bout.hfencer === f.name || bout.afencer === f.name) {
                                    meetsFenced += 1
                                    break
                                }
                            }
                        }
                    }
                    if (totalMeets === 0) {
                        finalPct = "0%"
                    } else {
                        finalPct = (Math.round(100 * meetsFenced / totalMeets))+"%"
                    }
                    console.log("navigating")
                    navigate('/fencerDetail', {state: {fencer: f, pctMeets: finalPct, season: (searchParams.get("season") ? searchParams.get("season") : season)}})
                    navigate(0)
                    // masterFencer = f
                    // setDetailData({name: f.name, school: f.school, squadName: genderWeapon(f)})
                    // fetch("https://api.isflfencing.com/meets.php?season=" + season)
                    //     .then(response => response.json())
                    //     .then(data => {setBouts(handleMeets(data.queryResults)); setBouts([...bouts])})
                }
            }
        } else {
            console.log("no id in URL")
            navigate("/fencers")
        }
    }

    useEffect(() => {
        if (!location.state) {
            console.log("loading from URL")
            fetchData()
        } else {
            console.log("loading from location")
            const fencer = location.state.fencer
            setDetailData({name: fencer.name, school: fencer.school, squadName: genderWeapon(fencer)})
            fetch("https://api.isflfencing.com/meets.php?season=" + (location.state.season ? location.state.season : season))
                .then(response => response.json())
                .then(data => {setBouts(handleMeets(data.queryResults)); setBouts([...bouts])})
            setSearchParams({id: hexEncode(fencer.name + "@" + fencer.school), season: (location.state.season ? location.state.season : season)})
            setFencerData(fencer)
        }
    }, [season])

    const getFencer = () => {
        console.log("getting fencer")
        console.log(fencerData)
    }

    return (
        <>
        <Header />
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1 style={{textAlign: "center"}} className={theme}>Fencer Details: {detailData.name} ({detailData.school} {detailData.squadName})</h1>
            {getFencer()}
            {fencerData !== {} && <>
                <h4 className={theme}><span style={{fontWeight: "400"}}>Win Rate:</span> {Math.round(100 * fencerData.boutsWon / (fencerData.boutsWon + fencerData.boutsLost))}%</h4>
                <h4 className={theme} style={{marginTop: "0rem", marginBottom: "0rem"}}><span style={{fontWeight: "400"}}>Bout Record (W-L):</span> {fencerData.boutsWon} - {fencerData.boutsLost} (Bout Indicator: {fencerData.boutsWon - fencerData.boutsLost})</h4>
                <h4 className={theme} style={{marginBottom: "0rem"}}><span style={{fontWeight: "400"}}>Touch Record (W-L):</span> {fencerData.touchesWon} - {fencerData.touchesLost} (Touch Indicator: {fencerData.touchesWon - fencerData.touchesLost})</h4>
                <h4 className={theme} style={{marginBottom: "0rem"}}><span style={{fontWeight: "400"}}>Percent of Meets Fenced:</span> {fencerData.pctMeets}%</h4>
                <h4 className={theme}><span style={{fontWeight: "400"}}>Percent of Bouts Fenced:</span> {fencerData.pctBouts}%</h4>
            </>}
            <hr style={{width: "98%", borderColor: c[theme].text}}/>
            <h3 className={theme}>—— Bouts ——</h3>
            <table style={{width: isMobile ? "95%" : "50rem", color: c[theme].text}}><tbody>
                <tr style={{fontSize: isMobile ? "1rem" : "1.1vw"}}>
                    <th style={{textAlign: "center"}}>Date</th>
                    <th style={{textAlign: "center"}}>Opponent</th>
                    <th style={{textAlign: "center"}}>Result</th>
                    <th style={{textAlign: "center"}}>Score</th>
                </tr>
                {sortedBouts().map(bout => (
                    <tr key={nanoid()} style={{fontSize: isMobile ? "0.8rem" : "0.9vw"}}>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{bout.date}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>vs. {bout.opponentName + " (" + bout.opponentSchool + ")"}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{bout.touchesWon > bout.touchesLost ? "Win" : "Loss"}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{bout.touchesWon}–{bout.touchesLost}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>
        </>
    )
}