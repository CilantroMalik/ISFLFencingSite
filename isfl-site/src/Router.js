import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from "./features/home/Home";
import { AddMeet } from "./features/addMeet/AddMeet";
import { ListMeets } from "./features/meets/ListMeets";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/addMeet" element={<AddMeet />}/>
            <Route path="/meets" element={<ListMeets />}/>
        </Routes>
    )
}

export default Router;