import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setSeason } from "../season/seasonSlice";
import '../../main.css'

export const Header = () => {
    let navigate = useNavigate()
    let dispatch = useDispatch()


    return (
        <div style={{width: "100vw", height: "6vh", display: "flex", backgroundColor: "#474741", alignItems: "center"}}>
            <h1 style={{marginLeft: "2rem"}}>ISFL Fencing</h1>
            <h5 style={{marginLeft: "auto"}}>Season: </h5>
            <select style={{width: "7vw", marginLeft: "1rem"}} className="muted-button" name="season" id="season" onChange={(e) => dispatch(setSeason(e.target.value))}>
                <option value="2021-2022">2021-2022</option>
                <option value="2022-2023">2022-2023</option>
            </select>
            <div style={{width: "2px", height: "85%", marginLeft: "2rem", backgroundColor: "#f1f7ed", border: "1px solid #f1f7ed", borderRadius: "1px"}}> </div>
            <button style={{marginLeft: "2rem"}} onClick={() => navigate('/meets')}>Meets</button>
            <button style={{marginLeft: "2rem"}} onClick={() => navigate('/teams')}>Teams</button>
            <button style={{marginLeft: "2rem", marginRight: "2rem"}} onClick={() => navigate('/addMeet')}>Add Meet</button>
        </div>
    )
}