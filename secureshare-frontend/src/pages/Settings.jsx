import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getSettings, updateSettings } from "../api";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getSettings();
      setNotifications(res.data.notifications);
      setEmailNotifications(res.data.emailNotifications);
      setDarkMode(res.data.darkMode);
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const handleToggle = async (key, value, setter) => {
    setter(value);
    try {
      await updateSettings({ [key]: value });
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  // LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-container">
          <div className="page-header">
            <div>
              <h1>Settings</h1>
              <p>Manage your SecureShare preferences and account settings.</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-card">
            <div className="settings-title">
              <div className="settings-icon">🔔</div>
              <div>
                <h3>Notifications</h3>
                <p>Control how you receive notifications.</p>
              </div>
            </div>

            <div className="setting-item">
              <div>
                <h4>Push Notifications</h4>
                <p>Receive notifications about your files and account.</p>
              </div>
              <button
                className={`toggle ${notifications ? "active" : ""}`}
                onClick={() =>
                  handleToggle("notifications", !notifications, setNotifications)
                }
              >
                <span></span>
              </button>
            </div>

            <div className="setting-item">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive important updates through email.</p>
              </div>
              <button
                className={`toggle ${emailNotifications ? "active" : ""}`}
                onClick={() =>
                  handleToggle(
                    "emailNotifications",
                    !emailNotifications,
                    setEmailNotifications
                  )
                }
              >
                <span></span>
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="settings-card">
            <div className="settings-title">
              <div className="settings-icon">🎨</div>
              <div>
                <h3>Appearance</h3>
                <p>Customize how SecureShare looks.</p>
              </div>
            </div>

            <div className="setting-item">
              <div>
                <h4>Dark Mode</h4>
                <p>Use dark mode for a darker interface.</p>
              </div>
              <button
                className={`toggle ${darkMode ? "active" : ""}`}
                onClick={() => handleToggle("darkMode", !darkMode, setDarkMode)}
              >
                <span></span>
              </button>
            </div>
          </div>

          {/* Logout Card */}
          <div className="logout-card">
            <div>
              <h3>Logout</h3>
              <p>Sign out of your SecureShare account.</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;