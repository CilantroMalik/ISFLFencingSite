import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { SquadResults } from "./SquadResults";
import { Header } from "../header/Header";

export const AddMeet = () => {

    const addedMeet = useSelector(state => state.addMeet)
    const [weapon, setWeapon] = useState("None")
    const navigate = useNavigate()

    const toggleWeapon = (w) => {
        if (weapon === w) { setWeapon("None") }
        else { setWeapon(w) }
    }

    const threeSquads = () => {
        let fullSquads = 0
        for (let bouts of Object.values(addedMeet)) {
            if (bouts.length !== 0) {
                fullSquads += 1
            }
        }
        return fullSquads >= 3
    }

    const squadsAdded = () => {
        let squads = []
        console.log(Object.keys(addedMeet))
        for (let squadName of Object.keys(addedMeet)) {
            console.log(addedMeet[squadName])
            if (addedMeet[squadName].length !== 0) {
                squads.push(squadName)
            }
        }
        return squads
    }

    const isFilled = (squadName) => {
        console.log("Squad Name: " + squadName)
        console.log(addedMeet[squadName])
        console.log(addedMeet[squadName].length !== 0)
        return (addedMeet[squadName].length !== 0 ? "green" : "#f1f7ed")
    }

    const finish = () => {
        // make API call with addedMeet state
        navigate("/")
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Header />
            <h2>Choose a weapon or finish adding meet:</h2>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <button style={{marginBottom: "1rem"}} onClick={() => toggleWeapon("Foil")} className={weapon === "Foil" ? "button" : "muted-button"}>Foil</button>
                    <p><span style={{color: isFilled("Boys Foil")}}>Boys</span> / <span style={{color: isFilled("Girls Foil")}}>Girls</span></p>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <button onClick={() => toggleWeapon("Epee")} className={weapon === "Epee" ? "button" : "muted-button"} style={{marginLeft: "3rem", marginRight: "3rem", marginBottom: "1rem"}}>Epee</button>
                    <p><span style={{color: isFilled("Boys Epee")}}>Boys</span> / <span style={{color: isFilled("Girls Epee")}}>Girls</span></p>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <button style={{marginBottom: "1rem"}} onClick={() => toggleWeapon("Saber")} className={weapon === "Saber" ? "button" : "muted-button"}>Saber</button>
                    <p><span style={{color: isFilled("Boys Saber")}}>Boys</span> / <span style={{color: isFilled("Girls Saber")}}>Girls</span></p>
                </div>
                <div style={{width: "2px", height: "5rem", marginLeft: "2rem", marginRight: "2rem", backgroundColor: "#f1f7ed", border: "1px solid #f1f7ed", borderRadius: "1px"}}> </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                    <button onClick={finish} style={{backgroundColor: threeSquads() ? "green" : "red", borderColor: threeSquads() ? "green" : "red", marginBottom: "1rem"}}>Finish</button>
                    <p>{threeSquads() ? "Click to add meet" : "Add more squads"}</p>
                </div>
            </div>
            { weapon !== "None" &&
                <div style={{display: "flex", justifyContent: "center"}}>
                    <SquadResults squadName={"Boys " + weapon}/>
                    <div style={{width: "10%"}}></div>
                    <SquadResults squadName={"Girls " + weapon}/>
                </div>
            }
            {weapon === "None" &&
                <>
                    <h4>Squads added:</h4>
                    {squadsAdded().map(squadName => <p>{squadName}</p>)}
                    {squadsAdded().length === 0 && <p>None yet.</p>}
                    <h5>Click a weapon at the top to add more squads.</h5>
                </>
            }
        </div>
    )

}
