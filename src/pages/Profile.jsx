import React from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Profile() {
  return (
    <div className="dashboard">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <div className="page-container">

          <div className="page-header">
            <div>
              <h1>Profile</h1>
              <p>
                Manage your personal account information.
              </p>
            </div>

            <button className="upload-button">
              ✏️ Edit Profile
            </button>
          </div>

          <div className="profile-card">

            <div className="profile-top">

              <div className="large-avatar">
                S
              </div>

              <div className="profile-basic">
                <h2>Suguna</h2>
                <p>👤 User</p>
              </div>

            </div>

            <div className="profile-section">

              <h3>Account Information</h3>

              <div className="profile-details">

                <div className="profile-detail">
                  <span className="detail-label">
                    Full Name
                  </span>

                  <span className="detail-value">
                    Suguna
                  </span>
                </div>

                <div className="profile-detail">
                  <span className="detail-label">
                    Email Address
                  </span>

                  <span className="detail-value">
                    suguna@example.com
                  </span>
                </div>

                <div className="profile-detail">
                  <span className="detail-label">
                    Account Type
                  </span>

                  <span className="detail-value">
                    User
                  </span>
                </div>

                <div className="profile-detail">
                  <span className="detail-label">
                    Member Since
                  </span>

                  <span className="detail-value">
                    August 2026
                  </span>
                </div>

              </div>

            </div>

            <div className="profile-section">

              <h3>Storage Information</h3>

              <div className="storage-info">

                <div className="storage-text">
                  <span>Cloud Storage</span>

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

          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;