import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import SharedFiles from "./pages/SharedFiles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/my-files" element={<MyFiles />} />

        <Route path="/shared-files" element={<SharedFiles />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;