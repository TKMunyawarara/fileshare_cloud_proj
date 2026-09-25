import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Settings() {

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="dashboard">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <div className="page-container">

          <div className="page-header">

            <div>
              <h1>Settings</h1>

              <p>
                Manage your SecureShare preferences and account settings.
              </p>
            </div>

          </div>


          {/* Notifications */}

          <div className="settings-card">

            <div className="settings-title">

              <div className="settings-icon">
                🔔
              </div>

              <div>
                <h3>Notifications</h3>

                <p>
                  Control how you receive notifications.
                </p>
              </div>

            </div>


            <div className="setting-item">

              <div>
                <h4>Push Notifications</h4>

                <p>
                  Receive notifications about your files and account.
                </p>
              </div>

              <button
                className={`toggle ${
                  notifications ? "active" : ""
                }`}
                onClick={() =>
                  setNotifications(!notifications)
                }
              >
                <span></span>
              </button>

            </div>


            <div className="setting-item">

              <div>
                <h4>Email Notifications</h4>

                <p>
                  Receive important updates through email.
                </p>
              </div>

              <button
                className={`toggle ${
                  emailNotifications ? "active" : ""
                }`}
                onClick={() =>
                  setEmailNotifications(!emailNotifications)
                }
              >
                <span></span>
              </button>

            </div>

          </div>


          {/* Privacy & Security */}

          <div className="settings-card">

            <div className="settings-title">

              <div className="settings-icon">
                🔒
              </div>

              <div>
                <h3>Privacy & Security</h3>

                <p>
                  Manage your account security.
                </p>
              </div>

            </div>


            <div className="setting-item">

              <div>
                <h4>Password</h4>

                <p>
                  Change your account password.
                </p>
              </div>

              <button className="settings-action-btn">
                Change Password
              </button>

            </div>


            <div className="setting-item">

              <div>
                <h4>Two-Factor Authentication</h4>

                <p>
                  Add an extra layer of security to your account.
                </p>
              </div>

              <button className="settings-action-btn">
                Enable
              </button>

            </div>

          </div>


          {/* Appearance */}

          <div className="settings-card">

            <div className="settings-title">

              <div className="settings-icon">
                🎨
              </div>

              <div>
                <h3>Appearance</h3>

                <p>
                  Customize how SecureShare looks.
                </p>
              </div>

            </div>


            <div className="setting-item">

              <div>
                <h4>Dark Mode</h4>

                <p>
                  Use dark mode for a darker interface.
                </p>
              </div>

              <button
                className={`toggle ${
                  darkMode ? "active" : ""
                }`}
                onClick={() =>
                  setDarkMode(!darkMode)
                }
              >
                <span></span>
              </button>

            </div>

          </div>


          {/* Storage */}

          <div className="settings-card">

            <div className="settings-title">

              <div className="settings-icon">
                ☁️
              </div>

              <div>
                <h3>Storage</h3>

                <p>
                  View your cloud storage usage.
                </p>
              </div>

            </div>


            <div className="storage-settings">

              <div className="storage-settings-top">

                <span>
                  Storage Used
                </span>

                <strong>
                  2.4 GB / 10 GB
                </strong>

              </div>

              <div className="storage-bar">

                <div className="storage-used"></div>

              </div>

              <p>
                24% of your storage is currently used.
              </p>

            </div>

          </div>


          {/* Logout */}

          <div className="logout-card">

            <div>

              <h3>Logout</h3>

              <p>
                Sign out of your SecureShare account.
              </p>

            </div>

            <button className="logout-btn">
              🚪 Logout
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Settings;