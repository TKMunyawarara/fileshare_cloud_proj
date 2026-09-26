import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import FileTable from "../components/FileTable";
import QuickActions from "../components/QuickActions";
import UploadModal from "../components/UploadModal";

import { getDashboardStats, getMyFiles, uploadFile } from "../api";

function Dashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState({
    totalFiles: 0,
    sharedFiles: 0,
    storageUsed: "0 GB / 10 GB",
    storagePercent: "0% Used",
  });
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "User";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, filesRes] = await Promise.all([
        getDashboardStats(),
        getMyFiles(),
      ]);
      setStats(statsRes.data);
      // Take up to 5 most recent files
      setRecentFiles(filesRes.data.slice(0, 5));
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      await uploadFile(file);
      alert("File uploaded successfully!");
      setShowUploadModal(false);
      loadDashboardData(); // Refresh stats & files
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="dashboard-content">
          {/* Welcome */}
          <section className="welcome-section">
            <h1>Welcome back, {userName}! 👋</h1>
            <p>Manage and securely share your files from the cloud.</p>
          </section>

          {/* Statistics */}
          <section className="stats-grid">
            <StatCard
              icon="📁"
              title="My Files"
              value={stats.totalFiles.toString()}
              subtitle="Total Files"
            />

            <StatCard
              icon="👥"
              title="Shared"
              value={stats.sharedFiles.toString()}
              subtitle="Shared Files"
            />

            <StatCard
              icon="☁️"
              title="Storage"
              value={stats.storageUsed}
              subtitle={stats.storagePercent}
            />
          </section>

          {/* Controls */}
          <section className="file-controls">
            <div className="search-box">
              <span>🔍</span>
              <input type="text" placeholder="Search files..." />
            </div>

            <button
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              ⬆️ Upload File
            </button>
          </section>

          {/* Recent Files Table */}
          <FileTable files={recentFiles} loading={loading} />

          {/* Quick Actions */}
          <QuickActions onUpload={() => setShowUploadModal(true)} />
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}

export default Dashboard;