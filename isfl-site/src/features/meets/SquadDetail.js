import React from 'react'
import {nanoid} from "@reduxjs/toolkit";
import { c } from '../../colors'
import {useSelector} from "react-redux";
import { isMobile } from "react-device-detect";

export const SquadDetail = (props) => {
    const theme = useSelector(state => state.theme.theme)

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: isMobile ? "95%" : "40%"}}>
            {props.squadData === undefined &&
                <>
                    <h3 style={{color: c[theme].text}}>{props.squadName}</h3>
                    <h5 style={{color: c[theme].text}}>This squad didn't compete in this meet.</h5>
                </>
            }
            { props.squadData !== undefined &&
                <><h3 style={{color: c[theme].text}}>{props.squadName}</h3>
                <hr style={{width: "100%", borderColor: c[theme].text}}/>
                <table style={{color: c[theme].text}}><tbody>
                    <tr style={{fontSize: isMobile ? "1rem" : "1.2vw"}}>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Score 1</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Fencer 1</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Fencer 2</th>
                        <th style={{textAlign: "center", borderColor: c[theme].text}}>Score 2</th>
                    </tr>
                    {props.squadData.map(bout => (
                        <tr key={nanoid()} style={{fontSize: isMobile ? "0.8rem" : "0.9vw"}}>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{bout.score1}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{bout.fencer1}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{bout.fencer2}</td>
                            <td style={{textAlign: "center", borderColor: c[theme].text}}>{bout.score2}</td>
                        </tr>
                    ))}
                </tbody></table></>
            }
        </div>
    )
}