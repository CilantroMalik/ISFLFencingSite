import React from 'react'

export const SquadDetail = (props) => {

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "40%"}}>
            {props.squadData === undefined &&
                <>
                    <h3>{props.squadName}</h3>
                    <h5>This squad didn't compete in this meet.</h5>
                </>
            }
            { props.squadData !== undefined &&
                <><h3 style={{color: "#f1f7ed"}}>{props.squadName}</h3>
                <hr style={{width: "100%"}}/>
                <table>
                    <tr>
                        <th style={{textAlign: "center"}}>Score 1</th>
                        <th style={{textAlign: "center"}}>Fencer 1</th>
                        <th style={{textAlign: "center"}}>Fencer 2</th>
                        <th style={{textAlign: "center"}}>Score 2</th>
                    </tr>
                    {props.squadData.map(bout => (
                        <tr>
                            <td style={{textAlign: "center"}}>{bout.score1}</td>
                            <td style={{textAlign: "center"}}>{bout.fencer1}</td>
                            <td style={{textAlign: "center"}}>{bout.fencer2}</td>
                            <td style={{textAlign: "center"}}>{bout.score2}</td>
                        </tr>
                    ))}
                </table></>
            }
        </div>
    )
}