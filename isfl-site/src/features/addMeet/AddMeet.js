import React, { useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import { SquadResults } from "./SquadResults";
import { Header } from "../header/Header";
import { addHomeTeam, addAwayTeam, addDate, addAllBoutsToSquad, reset } from "./addMeetSlice";
import { nanoid } from "@reduxjs/toolkit";
import { c } from "../../colors"

export const AddMeet = () => {
    const addedMeet = useSelector(state => state.addMeet)
    const season = useSelector(state => state.season.seasonInfo)
    const theme = useSelector(state => state.theme.theme)
    const [weapon, setWeapon] = useState("None")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [auth, setAuth] = useState("waiting")
    const [pass, setPass] = useState("")
    const [home, setHome] = useState("")
    const [away, setAway] = useState("")
    const [date, setDate] = useState("")

    const [fieldsFilled, setFieldsFilled] = useState({"Boys' Foil": {}, "Girls' Foil": {}, "Boys' Epee": {}, "Girls' Epee": {}, "Boys' Sabre": {}, "Girls' Sabre": {}})
    const [teamGender, setTeamGender] = useState("")

    const toggleWeapon = (w) => {
        if (weapon === w) { setWeapon("None") }
        else { setWeapon(w) }
    }

    const squadsAdded = () => {
        let squads = []
        //console.log(Object.keys(addedMeet))
        for (let squadName of Object.keys(addedMeet)) {
            //console.log(addedMeet[squadName])
            if (squadName !== "homeTeam" && squadName !== "awayTeam" && squadName !== "date") {
                if (addedMeet[squadName].length !== 0) { squads.push(squadName) }
            }
        }
        return squads
    }

    const isFilled = (squadName) => {
        //console.log("Squad Name: " + squadName)
        //console.log(addedMeet[squadName])
        //console.log(addedMeet[squadName].length !== 0)
        return (addedMeet[squadName].length !== 0 ? "green" : c[theme].text)
    }

    const handleChange = (gender, weapon, field, value) => {
        let newFieldsFilled = Object.assign({}, fieldsFilled)
        newFieldsFilled[gender + "' " + weapon][field] = value
        setFieldsFilled(newFieldsFilled)
        //console.log(fieldsFilled)
        if (Object.keys(fieldsFilled[gender + "' " + weapon]).length === 4) {
            dispatch(addAllBoutsToSquad({squadName: gender + "' " + weapon, bouts: [fieldsFilled[gender + "' " + weapon]]}))
        }
    }

    const finish = () => {
        if (home === "" || away === "" || date === "") { return }
        let meetData = {
            id: nanoid(),
            season: season.currentSeason,
            hteam: addedMeet.homeTeam,
            ateam: addedMeet.awayTeam,
            date: addedMeet.date,
            types: []
        }
        if (season.type === "i") {
            for (let squadName of Object.keys(addedMeet)) {
                if (squadName !== "homeTeam" && squadName !== "awayTeam" && squadName !== "date") {
                    if (addedMeet[squadName].length !== 0) {
                        const gw = squadName.split("' ")
                        meetData.types.push({
                            id: nanoid(),
                            weapon: gw[1].toLowerCase(),
                            gender: gw[0].toLowerCase(),
                            level: "varsity",
                            bouts: addedMeet[squadName].map(bout => ({
                                hfencer: bout.fencer1,
                                afencer: bout.fencer2,
                                htouch: bout.score1,
                                atouch: bout.score2,
                                winner: bout.score1 > bout.score2 ? "h" : "a"
                            }))
                        })
                    }
                }
            }
        } else {
            for (let squadName of Object.keys(addedMeet)) {
                if (squadName !== "homeTeam" && squadName !== "awayTeam" && squadName !== "date") {
                    if (addedMeet[squadName].length !== 0) {
                        const gw = squadName.split("' ")
                        meetData.types.push({
                            id: nanoid(),
                            weapon: gw[1].toLowerCase(),
                            gender: gw[0].toLowerCase(),
                            level: "varsity",
                            hBW: addedMeet[squadName][0].hBW,
                            hTW: addedMeet[squadName][0].hTW,
                            aBW: addedMeet[squadName][0].aBW,
                            aTW: addedMeet[squadName][0].aTW
                        })
                    }
                }
            }
        }
        let xhr = new XMLHttpRequest()
        //xhr.open("POST", "https://api.isflfencing.com/newAddMeet.php?season=" + season.currentSeason)
        xhr.open("POST", "http://localhost:8888/api/newAddMeet.php?season=2122")
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
        xhr.send(JSON.stringify({season: season.currentSeason, meet: meetData}))
        xhr.onload = () => {console.log(xhr.responseText)}
        dispatch(reset(""))
        navigate("/")
    }

    const hash = function(s) {
        let h = 0xbadface
        for(let i = 0; i < s.length; i++)
            h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
        return (h ^ h >>> 16) >>> 0;
    };

    return (
        <>
        {auth !== "success" && <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Header />
            <h3 className={theme}>Password required to access this page</h3>
            <input type="text" placeholder="Enter password" onChange={(e) => setPass(e.target.value)} style={{width: "60%", color: c[theme].text, borderColor: c[theme].text}}/>
            <button onClick={() => setAuth(hash(pass) === 1546490178 ? "success" : "failure")} style={{marginTop: "1rem"}}>Proceed</button>
            {auth === "failure" && <><h4 className={theme} style={{marginTop: "3rem"}}>Incorrect password.</h4><p className={theme}>Try again, or alternatively, please don't if you know you aren't supposed to be here :)</p></>}
        </div>}
        { auth === "success" && <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Header />
            <h2 className={theme} style={{marginBottom: "0rem"}}>Add Meet</h2>
            {season.type === "t" ? <h6 className={theme} style={{marginTop: "0rem"}}>This is a team stat season; you'll only need to add summary statistics, nothing about individual bouts.</h6> :
                <h6 className={theme} style={{marginTop: "0rem"}}>This is an individual stat season; you'll need to add information about fencers and individual bouts.</h6>}
            <hr style={{borderColor: c[theme].text, width: "80%", marginBottom: "1rem"}}/>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "1rem", marginRight: "1rem"}}>
                    <label className={theme} htmlFor="homeBouts" style={{marginBottom: '0.4rem'}}>Home Team</label>
                    <input type="text" placeholder="Home Team" style={{marginLeft: "1rem", marginRight: "1rem", color: c[theme].text, borderColor: c[theme].text}} onChange={(e) => {setHome(e.target.value); dispatch(addHomeTeam(e.target.value))}}/>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "1rem", marginRight: "1rem"}}>
                    <label className={theme} htmlFor="homeBouts" style={{marginBottom: '0.4rem'}}>Away Team</label>
                    <input type="text" placeholder="Away Team" style={{marginLeft: "1rem", marginRight: "1rem", color: c[theme].text, borderColor: c[theme].text}} onChange={(e) => {setAway(e.target.value); dispatch(addAwayTeam(e.target.value))}}/>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "1rem", marginRight: "1rem"}}>
                    <label className={theme} htmlFor="homeBouts" style={{marginBottom: '0.4rem'}}>Date</label>
                    <input type="date" placeholder="Date" style={{marginLeft: "1rem", marginRight: "1rem", color: addedMeet.date === "" ? "gray" : c[theme].text, borderColor: c[theme].text}} onChange={(e) => {setDate(e.target.value); dispatch(addDate(e.target.value))}}/>
                </div>
            </div>
            <h3>Choose a weapon or finish adding meet:</h3>
            {season.type === "i" &&
                <><div style={{display: "flex", justifyContent: "center"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button style={{marginBottom: "1rem"}} onClick={() => toggleWeapon("Foil")} className={weapon === "Foil" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Foil</button>
                        <p className={theme}><span style={{color: isFilled("Boys' Foil")}}>Boys</span> / <span style={{color: isFilled("Girls' Foil")}}>Girls</span></p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button onClick={() => toggleWeapon("Epee")} className={weapon === "Epee" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")} style={{marginLeft: "3rem", marginRight: "3rem", marginBottom: "1rem"}}>Epee</button>
                        <p className={theme}><span style={{color: isFilled("Boys' Epee")}}>Boys</span> / <span style={{color: isFilled("Girls' Epee")}}>Girls</span></p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button style={{marginBottom: "1rem"}} onClick={() => toggleWeapon("Sabre")} className={weapon === "Sabre" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")}>Sabre</button>
                        <p className={theme}><span style={{color: isFilled("Boys' Sabre")}}>Boys</span> / <span style={{color: isFilled("Girls' Sabre")}}>Girls</span></p>
                    </div>
                    <div style={{width: "2px", height: "5rem", marginLeft: "2rem", marginRight: "2rem", backgroundColor: c[theme].text, border: "1px solid "+c[theme].text, borderRadius: "1px"}}></div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <button onClick={finish} style={{backgroundColor: (home !== "" && away !== "" && date !== "") ? "green" : "red", borderColor: (home !== "" && away !== "" && date !== "") ? "green" : "red", marginBottom: "1rem"}}>Finish</button>
                        <p className={theme}>{(home !== "" && away !== "" && date !== "") ? "Click to add meet" : "Add required meet info"}</p>
                    </div>
                </div>
            {weapon !== "None" &&
                <div style={{display: "flex", justifyContent: "center"}}>
                    <SquadResults squadName={"Boys' " + weapon}/>
                    <div style={{width: "10%"}}></div>
                    <SquadResults squadName={"Girls' " + weapon}/>
                </div>
            }
            {weapon === "None" &&
                <><h4 className={theme}>Squads added:</h4>
            {squadsAdded().map(squadName => <p className={theme} key={nanoid()}>{squadName}</p>)}
            {squadsAdded().length === 0 && <p className={theme}>None yet.</p>}
                <h5 className={theme}>Click a weapon at the top to add more squads.</h5></>
            }</>}
            {season.type === "t" &&
                <>
                    <div className="flex-row">
                        <button className={teamGender === "Boys" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")} onClick={() => setTeamGender("Boys")} style={{marginRight: "2rem"}}>Boys</button>
                        <button className={teamGender === "Girls" ? "button" : (theme === "dark" ? "muted-button" : "muted-button-light")} onClick={() => setTeamGender("Girls")}>Girls</button>
                    </div>
                    { teamGender !== "" &&
                        <>
                            <h3 className={theme} style={{marginBottom: "0"}}>—— {teamGender}' Foil ——</h3>
                                <div className="flex-row">
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                        <label htmlFor="homeBouts">Home Bouts Won</label>
                                        <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                               onChange={(e) => handleChange(teamGender, "Foil", "hBW", e.target.value)}/>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                        <label htmlFor="homeTouches">Home Touches Won</label>
                                        <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                               onChange={(e) => handleChange(teamGender, "Foil", "hTW", e.target.value)}/>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                        <label htmlFor="awayBouts">Away Bouts Won</label>
                                        <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                               onChange={(e) => handleChange(teamGender, "Foil", "aBW", e.target.value)}/>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                        <label htmlFor="awayTouches">Away Touches Won</label>
                                        <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                               onChange={(e) => handleChange(teamGender, "Foil", "aTW", e.target.value)}/>
                                    </div>
                            </div>
                            <hr style={{borderColor: c[theme].text, marginTop: "2rem", width: "50%"}}/>

                            <h3 className={theme} style={{marginBottom: "0"}}>—— {teamGender}' Epee ——</h3>
                            <div className="flex-row">
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                    <label htmlFor="homeBouts">Home Bouts Won</label>
                                    <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                           onChange={(e) => handleChange(teamGender, "Epee", "hBW", e.target.value)}/>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                    <label htmlFor="homeTouches">Home Touches Won</label>
                                    <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                           onChange={(e) => handleChange(teamGender, "Epee", "hTW", e.target.value)}/>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                    <label htmlFor="awayBouts">Away Bouts Won</label>
                                    <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                           onChange={(e) => handleChange(teamGender, "Epee", "aBW", e.target.value)}/>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                    <label htmlFor="awayTouches">Away Touches Won</label>
                                    <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                           onChange={(e) => handleChange(teamGender, "Epee", "aTW", e.target.value)}/>
                                </div>
                            </div>
                            <hr style={{borderColor: c[theme].text, marginTop: "2rem", width: "50%"}}/>

                            <h3 className={theme} style={{marginBottom: "0"}}>—— {teamGender}' Sabre ——</h3>
                            <div className="flex-row">
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                    <label htmlFor="homeBouts">Home Bouts Won</label>
                                    <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                           onChange={(e) => handleChange(teamGender, "Sabre", "hBW", e.target.value)}/>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                    <label htmlFor="homeTouches">Home Touches Won</label>
                                    <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                           onChange={(e) => handleChange(teamGender, "Sabre", "hTW", e.target.value)}/>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                    <label htmlFor="awayBouts">Away Bouts Won</label>
                                    <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                           onChange={(e) => handleChange(teamGender, "Sabre", "aBW", e.target.value)}/>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2rem"}}>
                                    <label htmlFor="awayTouches">Away Touches Won</label>
                                    <input type="number" placeholder="0" className="muted-button" style={{width: "27%", textAlign: "center", color: c[theme].text, borderColor: c[theme].text}}
                                           onChange={(e) => handleChange(teamGender, "Sabre", "aTW", e.target.value)}/>
                                </div>
                            </div>
                            <hr style={{borderColor: c[theme].text, marginTop: "2rem", width: "50%"}}/>

                            <button onClick={finish} style={{backgroundColor: (home !== "" && away !== "" && date !== "") ? "green" : "red", borderColor: (home !== "" && away !== "" && date !== "") ? "green" : "red", marginBottom: "1rem", marginTop: "1rem"}}>Finish</button>
                            <p className={theme}>{(home !== "" && away !== "" && date !== "") ? "Click to add meet" : "Add required meet info"}</p>

                        </>}
                </>
            }
        </div>}</>
    )

}
