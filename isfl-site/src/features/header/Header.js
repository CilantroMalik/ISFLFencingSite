import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setSeason } from "../season/seasonSlice";
import '../../main.css'

export const Header = () => {
    let navigate = useNavigate()
    let dispatch = useDispatch()

    const [hover, setHover] = useState(false)


    return (
        <div style={{width: "100vw", height: "5rem", display: "flex", backgroundColor: "#474741", alignItems: "center"}}>
            <h1 style={hover ? {marginLeft: "2rem", padding: "0.5rem", background: "#2D2D2D", borderRadius: "5px", transition: "background 0.5s"} : {marginLeft: "2rem", padding: "0.5rem", transition: "background 0.5s"}}
                onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => navigate('/')}>ISFL Fencing</h1>
            <h5 style={{marginLeft: "auto"}}>Season: </h5>
            <select style={{width: "7vw", marginLeft: "1rem"}} className="muted-button" name="season" id="season" onChange={(e) => dispatch(setSeason(e.target.value))}>
                <option value="2122">2021-2022</option>
                <option value="2223">2022-2023</option>
                <option value="test">Test</option>
            </select>
            <div style={{width: "2px", height: "85%", marginLeft: "2rem", backgroundColor: "#f1f7ed", border: "1px solid #f1f7ed", borderRadius: "1px"}}> </div>
            <button style={{marginLeft: "2rem"}} onClick={() => navigate('/fencers')}>Fencers</button>
            <button style={{marginLeft: "2rem"}} onClick={() => navigate('/teams')}>Teams</button>
            <button style={{marginLeft: "2rem"}} onClick={() => navigate('/meets')}>Meets</button>
            <button style={{marginLeft: "2rem", marginRight: "2rem"}} onClick={() => navigate('/addMeet')}>Add Meet</button>
        </div>
    )
}