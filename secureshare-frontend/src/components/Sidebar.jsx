import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      
      {/* Logo */}
      <div className="logo">
        ☁️ <span>SecureShare</span>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">

        <NavLink to="/" className="menu-item">
          🏠 <span>Dashboard</span>
        </NavLink>

        <NavLink to="/my-files" className="menu-item">
          📁 <span>My Files</span>
        </NavLink>

        <NavLink to="/shared-files" className="menu-item">
          👥 <span>Shared With Me</span>
        </NavLink>

        <NavLink to="/profile" className="menu-item">
          👤 <span>Profile</span>
        </NavLink>

        <NavLink to="/settings" className="menu-item">
          ⚙️ <span>Settings</span>
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="logout-section">
        <button className="menu-item logout-menu" onClick={handleLogout}>
          🚪 <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;