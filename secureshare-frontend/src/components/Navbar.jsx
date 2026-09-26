import React from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Read logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "User";
  const userRole = user.accountType || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  const pageTitles = {
    "/": "Dashboard",
    "/my-files": "My Files",
    "/shared-files": "Shared With Me",
    "/profile": "Profile",
    "/settings": "Settings",
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>{pageTitles[location.pathname] || "Dashboard"}</h2>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">🔔</button>

        <div className="user-profile">
          <div className="user-avatar">{avatarLetter}</div>

          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>

          <span className="dropdown">▾</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;