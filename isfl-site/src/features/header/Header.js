import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import { setSeason } from "../season/seasonSlice";
import { setTypes } from "../season/typesSlice";
import { setTheme } from "../theme/themeSlice";
import { c } from "../../colors";
import '../../main.css'
import { isMobile } from 'react-device-detect'

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
            .then(data => {
                setSeasonTypes(data); dispatch(setTypes(data))
            })
    }, [setSeasonTypes])

    const switchTheme = () => {
        dispatch(setTheme(theme === "dark" ? "light" : "dark"))
    }

    return (
        isMobile ?
            <div style={{backgroundColor: c[theme].headerBG, width: "max-content"}}>
                <div style={{width: "max-content", height: "5rem", display: "flex", backgroundColor: c[theme].headerBG, alignItems: "center"}}>
                    <h2 className={theme} style={hover ? {marginLeft: "1rem", padding: "0.5rem", background: c[theme].mainBG, borderRadius: "5px", transition: "background 0.5s"} : {marginLeft: "1rem", padding: "0.5rem", transition: "background 0.5s"}}
                        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => navigate('/')}>ISFL Fencing</h2>
                    <div style={{width: "2px", height: "85%", marginLeft: "1rem", backgroundColor: c[theme].text, border: "1px solid " + c[theme].text, borderRadius: "1px"}}> </div>
                    <h5 className={theme} style={{marginLeft: "1rem"}}>Season: </h5>
                    <select style={{width: "8rem", marginLeft: "1rem", marginRight: "1rem", color: c[theme].text, borderColor: c[theme].text}} className="muted-button" name="season" id="season" onChange={(e) => {
                        console.log(e.target.value)
                        dispatch(setSeason({
                            currentSeason: e.target.value,
                            type: types[e.target.value].type === "team" ? "t" : "i",
                            name: types[e.target.value].name
                        }))
                    }}>
                        {Object.keys(seasonTypes).map(t => <option key={t} value={t} selected={t === season.currentSeason}>{seasonTypes[t].name}</option>)}
                    </select>
                    <button style={{marginLeft: "0.7rem", marginRight: "0.7rem", padding: "0.4rem", width: "15vw", fontSize: "0.7rem"}} onClick={switchTheme}>Toggle Theme</button>

                </div>
                <div style={{width: "max-content", height: "5rem", display: "flex", backgroundColor: c[theme].headerBG, alignItems: "center"}}>
                    {season.type === "i" && <button style={{marginLeft: "1rem", fontSize: "1rem", padding: "0.7rem 1rem"}} onClick={() => navigate('/fencers')}>Fencers</button>}
                    <button style={{marginLeft: "1rem", fontSize: "1rem", padding: "0.7rem 1rem"}} onClick={() => navigate('/teams', {state: {squadName: null}})}>Teams</button>
                    <button style={{marginLeft: "1rem", fontSize: "1rem", padding: "0.7rem 1rem"}} onClick={() => navigate('/meets')}>Meets</button>
                    {/*<button style={{marginLeft: "1rem", marginRight: "1rem", fontSize: "1rem", padding: "0.7rem 1rem"}} onClick={() => navigate('/addMeet')}>Add Meet</button>*/}
                    <a href={"https://old.isflfencing.com/addMeet.php?season="+season.currentSeason}><button style={{marginLeft: "1.5rem", marginRight: "1.5rem"}}>Add Meet</button></a>
                </div>
            </div>
        :
            <div style={{width: "100vw", height: "5rem", display: "flex", backgroundColor: c[theme].headerBG, alignItems: "center"}}>
                <h3 className={theme} style={hover ? {marginLeft: "1rem", padding: "0.5rem", background: c[theme].mainBG, borderRadius: "5px", transition: "background 0.5s"} : {marginLeft: "1rem", padding: "0.5rem", transition: "background 0.5s"}}
                    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => navigate('/')}>ISFL Fencing</h3>
                <button style={{marginLeft: "1rem", marginRight: "1rem"}} onClick={switchTheme}>Toggle Theme</button>
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
                <div style={{width: "2px", height: "85%", marginLeft: "1.5rem", backgroundColor: c[theme].text, border: "1px solid " + c[theme].text, borderRadius: "1px"}}> </div>
                {season.type === "i" && <button style={{marginLeft: "1.5rem"}} onClick={() => navigate('/fencers')}>Fencers</button>}
                <button style={{marginLeft: "1.5rem"}} onClick={() => navigate('/teams', {state: {squadName: null}})}>Teams</button>
                <button style={{marginLeft: "1.5rem"}} onClick={() => navigate('/meets')}>Meets</button>
                {/*<button style={{marginLeft: "1.5rem", marginRight: "1.5rem"}} onClick={() => navigate('/addMeet')}>Add Meet</button>*/}
                <a href={"https://old.isflfencing.com/addMeet.php?season="+season.currentSeason}><button style={{marginLeft: "1.5rem", marginRight: "1.5rem"}}>Add Meet</button></a>
            </div>
    )
}