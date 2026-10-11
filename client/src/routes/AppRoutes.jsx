import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import VideoRoom from "../pages/VideoRoom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard"
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/video" element={<ProtectedRoute><VideoRoom /></ProtectedRoute>} />
        </Routes>
    );
}

export default AppRoutes;