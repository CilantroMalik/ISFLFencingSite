import React, { useEffect } from 'react';
import { Header } from "../header/Header";
import { setTypes } from "../season/typesSlice";
import {useSelector } from "react-redux";
import { c } from "../../colors"

export const Home = () => {

    const theme = useSelector(state => state.theme.theme)
    // useEffect(() => {
    //     fetch("https://api.isflfencing.com/seasons.php")
    //         .then(response => response.json())
    //         .then(data => dispatch(setTypes(data)))
    // })

    return (
        <>
        <Header/>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100vw", height: "100vh", backgroundColor: c[theme].mainBG, color: c[theme].text}}>

            <h1 className={theme}>Home</h1>
            <br/>
            <hr style={{width: "50vw", borderColor: c[theme].text}}/>
            <h2 className={theme}>Welcome to ISFL Fencing!</h2>
            <hr style={{width: "50vw", borderColor: c[theme].text}}/>
            <br/>
            <p className={theme} style={{margin: "2rem", textAlign: "center"}}>ISFL Fencing is an online database for reporting fencing league results. Once results are received, ISFL Fencing generates detailed statistics for teams and individual fencers. It is a replacement for the earlier BoutShout software that stopped operating a couple years ago.</p>
            <p className={theme} style={{margin: "2rem"}}>ISFL Fencing is currently in beta testing, and is available only for the Independent Schools Fencing League.</p>
            <p className={theme} style={{margin: "2rem"}}>Please direct any questions, concerns, or bug reports to snadol@students.hackleyschool.org and/or rohan_malik@ryecountryday.org.</p>
        </div>
        </>
    )
}