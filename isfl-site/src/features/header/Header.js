import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import { setSeason } from "../season/seasonSlice";
import { setTypes } from "../season/typesSlice";
import { setTheme } from "../theme/themeSlice";
import { c } from "../../colors";
import '../../main.css'

export const Header = () => {
    let navigate = useNavigate()
    let dispatch = useDispatch()
    const season = useSelector(state => state.season.seasonInfo)
    const types = useSelector(state => state.types.typesInfo)
    const theme = useSelector(state => state.theme.theme)

    const [hover, setHover] = useState(false)

    const [seasonTypes, setSeasonTypes] = useState([])

    useEffect(() => {
        fetch("https://api.isflfencing.com/seasons.php")
            .then(response => response.json())
            .then(data => {setSeasonTypes(data); dispatch(setTypes(data))})
    }, [setSeasonTypes])

    const switchTheme = () => {
        dispatch(setTheme(theme === "dark" ? "light" : "dark"))
    }

    return (
        <div style={{width: "100vw", height: "5rem", display: "flex", backgroundColor: c[theme].headerBG, alignItems: "center"}}>
            <h1 className={theme} style={hover ? {marginLeft: "2rem", padding: "0.5rem", background: c[theme].mainBG, borderRadius: "5px", transition: "background 0.5s"} : {marginLeft: "2rem", padding: "0.5rem", transition: "background 0.5s"}}
                onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => navigate('/')}>ISFL Fencing</h1>
            <button style={{marginLeft: "1rem"}} onClick={switchTheme}>Toggle {theme === "dark" ? "Light" : "Dark"} Theme</button>
            <h5 className={theme} style={{marginLeft: "auto"}}>Season: </h5>
            <select style={{width: "8rem", marginLeft: "1rem", color: c[theme].text, borderColor: c[theme].text}} className="muted-button" name="season" id="season" onChange={(e) => {
                console.log(e.target.value)
                dispatch(setSeason({
                    currentSeason: e.target.value,
                    type: types[e.target.value].type === "team" ? "t" : "i",
                    name: types[e.target.value].name
                }))
            }}>
                {Object.keys(seasonTypes).map(t => <option key={t} value={t} selected={t === season.currentSeason}>{seasonTypes[t].name}</option>)}
            </select>
            <div style={{width: "2px", height: "85%", marginLeft: "2rem", backgroundColor: c[theme].text, border: "1px solid " + c[theme].text, borderRadius: "1px"}}> </div>
            {season.type === "i" && <button style={{marginLeft: "2rem"}} onClick={() => navigate('/fencers')}>Fencers</button>}
            <button style={{marginLeft: "2rem"}} onClick={() => navigate('/teams', {state: {squadName: null}})}>Teams</button>
            <button style={{marginLeft: "2rem"}} onClick={() => navigate('/meets')}>Meets</button>
            <button style={{marginLeft: "2rem", marginRight: "2rem"}} onClick={() => navigate('/addMeet')}>Add Meet</button>
        </div>
    )
}