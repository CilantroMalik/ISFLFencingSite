import React, { useEffect, useState } from 'react';
import { Header } from "../header/Header";

export const ListFencers = () => {
    const [searchFencer, setSearchFencer] = useState("")
    const [searchSchool, setSearchSchool] = useState("")

    useEffect(() => {
        // fetch data from API and update fencers
    })

    const fencers = [{id: "0000000", name: "Rohan Malik", school: "RCDS", boutsWon: 0, boutsLost: 1, touchesWon: 3, touchesLost: 5}]

}