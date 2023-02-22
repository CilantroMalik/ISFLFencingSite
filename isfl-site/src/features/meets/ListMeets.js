import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router";
import { Header } from "../header/Header";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { c } from "../../colors"
import '../../main.css'
import { isMobile } from "react-device-detect";

export const ListMeets = () => {
    // const meets = [{"id": 1646142830, "season": "20212022", "hteam": "Avenues", "ateam": "St Anns", "date": "2022-02-10",
    //     "types": [
    //         {"id": "1646142830ebv", "weapon": "epee", "gender": "boys", "level": "varsity", "hBW": "7", "aBW": "2", "hTW": "32", "aTW": "21"},
    //         {"id": "1646142830fbv", "weapon": "foil", "gender": "boys", "level": "varsity", "hBW": "9", "aBW": "0", "hTW": "43", "aTW": "15"}
    //     ]
    // }]

    const [meets, setMeets] = useState([])
    const [school, setSchool] = useState("All")

    const navigate = useNavigate()
    const season = useSelector(state => state.season.seasonInfo.currentSeason)
    const type = useSelector(state => state.season.seasonInfo.type)
    const theme = useSelector(state => state.theme.theme)

    useEffect(() => {
        fetch("https://api.isflfencing.com/meets.php?season=" + season)
            .then(response => response.json())
            .then(data => {
                if (data.seasonType === "t") { setMeets(data.queryResults) }
                else { setMeets(data.queryResults.map(meet => addTotals(meet))) }
            })
    }, [season])

    const addTotals = (meet) => {
        let newTypes = []
        for (const type of meet.types) {
            let hBW = 0
            let aBW = 0
            let hTW = 0
            let aTW = 0
            for (const bout of type.bouts) {
                hTW += parseInt(bout.htouch)
                aTW += parseInt(bout.atouch)
                if (bout.winner === "h") { hBW += 1 }
                else {  aBW += 1 }
            }
            type.hBW = hBW
            type.aBW = aBW
            type.hTW = hTW
            type.aTW = aTW
            newTypes.push(type)
        }
        meet.types = newTypes
        return meet
    }

    const sortedMeets = () => {
        return meets.filter(m => school === "All" || (m.hteam === school || m.ateam === school)).sort((meet1, meet2) => {
            const date1 = new Date(meet1.date)
            date1.setHours(0, 0, 0, 0)
            const date2 = new Date(meet2.date)
            date2.setHours(0, 0, 0, 0)
            if (date1 > date2) { return -1 }
            else if (date1 < date2) { return 1 }
            else {
                if (meet1.hteam > meet2.hteam) { return 1 }
                else if (meet1.hteam < meet2.hteam) { return -1 }
                else {
                    if (meet1.ateam > meet2.ateam) { return 1 }
                    else if (meet1.ateam < meet2.ateam) { return -1 }
                    else { return 0 }
                }
            }
        })
    }

    const hasType = (meet, gender, weapon) => {
        for (const type of meet.types) {
            if (type.gender === gender && type.weapon === weapon) { return true }
        }
        return false
    }

    const findType1 = (meet, gender, weapon) => {
        for (const type of meet.types) {
            if (type.gender === gender && type.weapon === weapon) {
                return "\u00A0" + type.hBW + "-" + type.aBW + "\u00A0"
            }
        }
    }

    const findType2 = (meet, gender, weapon) => {
        for (const type of meet.types) {
            if (type.gender === gender && type.weapon === weapon) {
                return "(" + type.hTW + "-" + type.aTW + ")"
            }
        }
    }

    const getSchools = () => {
        let schools = []
        for (const meet of meets) {
            if (!schools.includes(meet.hteam)) { schools.push(meet.hteam) }
            if (!schools.includes(meet.ateam)) { schools.push(meet.ateam) }
        }
        return schools
    }

    const spawnDetail = (meetObj) => {
        if (type === "i") { navigate({pathname: "/meetDetail", search: "?id=" + meetObj.id + "&season=" + season}, {state: {meet: meetObj}}) }
    }

    return (
        <>
        <div className="hidePrint"><Header/></div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1 className={theme} style={{marginBottom: type === "i" ? "0" : "1rem"}}>Meets</h1>
            {type === "i" && <h5 style={{color: c[theme].text, textAlign: "center"}} className="hidePrint">Click on a meet to view a detailed breakdown of the bouts.</h5>}
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: isMobile ? "80%" : "25%"}} className="hidePrint">
                <h4 className={theme} style={{width: "100%", textAlign: "center"}}>Filter by school:</h4>
                <select style={{flexGrow: 1, color: c[theme].text, borderColor: c[theme].text}} name="school" id="school" className="muted-button" onChange={(e) => setSchool(e.target.value)}>
                    <option value="All" selected={school === "All"}>All</option>
                    {getSchools().map(item => <option key={nanoid()} selected={item === school} value={item}>{item}</option>)}
                </select>
            </div>
            <hr style={{width: "98%", borderColor: c[theme].text}}/>
            {!isMobile && <table style={{width: "90%", color: c[theme].text}}>
                <tbody>
                <tr style={{fontSize: "1.2vw"}}>
                    <th colSpan="3" style={{textAlign: "center", borderColor: c[theme].text}}>Info</th>
                    <th colSpan="6" style={{textAlign: "center", borderColor: c[theme].text}}>Scores (Bouts/Touches)
                    </th>
                </tr>
                <tr style={{fontSize: "1.1vw"}}>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Date</th>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Home Team</th>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Away Team</th>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Boys' Foil</th>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Girls' Foil</th>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Boys' Epee</th>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Girls' Epee</th>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Boys' Sabre</th>
                    <th style={{textAlign: "center", borderColor: c[theme].text}}>Girls' Sabre</th>
                </tr>
                <tr>
                </tr>
                {sortedMeets().map(meet => (
                    <tr key={nanoid()}
                        className={type === "i" ? (theme === "dark" ? "meet-row" : "meet-row-light") : ""}
                        style={{fontSize: "0.9vw", borderRadius: "1rem"}} onClick={() => spawnDetail(meet)}>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{meet.date}</td>
                        {school !== meet.hteam ?
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{meet.hteam}</td> :
                            <td style={{textAlign: "center", borderColor: c[theme].text}}><strong><em>{meet.hteam}</em></strong>
                            </td>
                        }
                        {school !== meet.ateam ?
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{meet.ateam}</td> :
                            <td style={{textAlign: "center", borderColor: c[theme].text}}><strong><em>{meet.ateam}</em></strong>
                            </td>
                        }
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "boys", "foil") ?
                            <span><strong>{findType1(meet, "boys", "foil")}</strong> {findType2(meet, "boys", "foil")}</span> : "No results"}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "girls", "foil") ?
                            <span><strong>{findType1(meet, "girls", "foil")}</strong> {findType2(meet, "girls", "foil")}</span> : "No results"}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "boys", "epee") ?
                            <span><strong>{findType1(meet, "boys", "epee")}</strong> {findType2(meet, "boys", "epee")}</span> : "No results"}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "girls", "epee") ?
                            <span><strong>{findType1(meet, "girls", "epee")}</strong> {findType2(meet, "girls", "epee")}</span> : "No results"}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "boys", "sabre") ?
                            <span><strong>{findType1(meet, "boys", "sabre")}</strong> {findType2(meet, "boys", "sabre")}</span> : "No results"}</td>
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "girls", "sabre") ?
                            <span><strong>{findType1(meet, "girls", "sabre")}</strong> {findType2(meet, "girls", "sabre")}</span> : "No results"}</td>
                    </tr>
                ))}
                </tbody>
            </table>}
        </div>
            {isMobile &&
            <table style={{width: "95%", color: c[theme].text}}><tbody>
            <tr style={{fontSize: "1.1rem"}}>
                <th colSpan="3" style={{textAlign: "center", borderColor: c[theme].text}}>Info</th>
                <th colSpan="6" style={{textAlign: "center", borderColor: c[theme].text}}>Scores (Bouts/Touches)</th>
            </tr>
            <tr style={{fontSize: "1rem"}}>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Date</th>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Home Team</th>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Away Team</th>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Boys' Foil</th>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Girls' Foil</th>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Boys' Epee</th>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Girls' Epee</th>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Boys' Sabre</th>
                <th style={{textAlign: "center", borderColor: c[theme].text}}>Girls' Sabre</th>
            </tr>
            <tr>
            </tr>
            {sortedMeets().map(meet => (
                <tr key={nanoid()} className={type === "i" ? (theme === "dark" ? "meet-row" : "meet-row-light") : ""} style={{fontSize: "0.8rem", borderRadius: "1rem"}} onClick={() => spawnDetail(meet)}>
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{meet.date}</td>
                    {school !== meet.hteam ?
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{meet.hteam}</td> :
                        <td style={{textAlign: "center", borderColor: c[theme].text}}><strong><em>{meet.hteam}</em></strong></td>
                    }
                    {school !== meet.ateam ?
                        <td style={{textAlign: "center", borderColor: c[theme].text}}>{meet.ateam}</td> :
                        <td style={{textAlign: "center", borderColor: c[theme].text}}><strong><em>{meet.ateam}</em></strong></td>
                    }
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "boys", "foil") ? <span><strong>{findType1(meet, "boys", "foil")}</strong> <span style={{fontSize: "0.6rem"}}>{findType2(meet, "boys", "foil")}</span></span> : "No results"}</td>
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "girls", "foil") ? <span><strong>{findType1(meet, "girls", "foil")}</strong> <span style={{fontSize: "0.6rem"}}>{findType2(meet, "girls", "foil")}</span></span> : "No results"}</td>
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "boys", "epee") ? <span><strong>{findType1(meet, "boys", "epee")}</strong> <span style={{fontSize: "0.6rem"}}>{findType2(meet, "boys", "epee")}</span></span> : "No results"}</td>
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "girls", "epee") ? <span><strong>{findType1(meet, "girls", "epee")}</strong> <span style={{fontSize: "0.6rem"}}>{findType2(meet, "girls", "epee")}</span></span> : "No results"}</td>
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "boys", "sabre") ? <span><strong>{findType1(meet, "boys", "sabre")}</strong> <span style={{fontSize: "0.6rem"}}>{findType2(meet, "boys", "sabre")}</span></span> : "No results"}</td>
                    <td style={{textAlign: "center", borderColor: c[theme].text}}>{hasType(meet, "girls", "sabre") ? <span><strong>{findType1(meet, "girls", "sabre")}</strong> <span style={{fontSize: "0.6rem"}}>{findType2(meet, "girls", "sabre")}</span></span> : "No results"}</td>
                </tr>
            ))}
            </tbody></table>
            }
        </>
    )
}