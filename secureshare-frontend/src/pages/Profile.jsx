import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getProfile } from "../api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const avatarLetter = profile?.fullName
    ? profile.fullName.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-container">
          <div className="page-header">
            <div>
              <h1>Profile</h1>
              <p>Manage your personal account information.</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading profile... ☁️
            </div>
          ) : (
            <div className="profile-card">
              <div className="profile-top">
                <div className="large-avatar">{avatarLetter}</div>
                <div className="profile-basic">
                  <h2>{profile?.fullName}</h2>
                  <p>👤 {profile?.accountType || "User"}</p>
                </div>
              </div>

              <div className="profile-section">
                <h3>Account Information</h3>
                <div className="profile-details">
                  <div className="profile-detail">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{profile?.fullName}</span>
                  </div>

                  <div className="profile-detail">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{profile?.email}</span>
                  </div>

                  <div className="profile-detail">
                    <span className="detail-label">Account Type</span>
                    <span className="detail-value">
                      {profile?.accountType}
                    </span>
                  </div>

                  <div className="profile-detail">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">
                      {profile?.memberSince}
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
                      {profile?.storageUsed} / {profile?.storageTotal}
                    </strong>
                  </div>

                  <div className="storage-bar">
                    <div
                      className="storage-used"
                      style={{ width: `${profile?.storagePercent || 0}%` }}
                    ></div>
                  </div>

                  <p>{profile?.storagePercent || 0}% of your storage is currently used.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;