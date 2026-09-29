import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import SharedFiles from "./pages/SharedFiles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login"; // Make sure to create this file in src/pages/Login.jsx

import "./App.css";

// Helper component to guard pages from unauthenticated users
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  // Restore dark mode preference on page load/refresh
React.useEffect(() => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
}, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-files"
          element={
            <ProtectedRoute>
              <MyFiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shared-files"
          element={
            <ProtectedRoute>
              <SharedFiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Redirect any other path to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;