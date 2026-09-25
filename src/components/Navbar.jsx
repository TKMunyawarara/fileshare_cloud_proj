import React from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

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

        <button className="notification-btn">
          🔔
        </button>

        <div className="user-profile">

          <div className="user-avatar">
            S
          </div>

          <div className="user-info">

            <span className="user-name">
              Suguna
            </span>

            <span className="user-role">
              User
            </span>

          </div>

          <span className="dropdown">
            ▾
          </span>

        </div>

      </div>

    </header>
  );
}

export default Navbar;