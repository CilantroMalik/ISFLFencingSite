import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from "./features/home/Home";
import { AddMeet } from "./features/addMeet/AddMeet";
import { ListMeets } from "./features/meets/ListMeets";
import { MeetDetail } from "./features/meets/MeetDetail";
import { ListTeams } from "./features/teams/ListTeams";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/addMeet" element={<AddMeet />}/>
            <Route path="/meets" element={<ListMeets />}/>
            <Route path="/meetDetail" element={<MeetDetail />}/>
            <Route path="/teams" element={<ListTeams />}/>
        </Routes>
    )
}

export default Router;