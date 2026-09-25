import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import FileTable from "../components/FileTable";
import QuickActions from "../components/QuickActions";
import UploadModal from "../components/UploadModal";

function Dashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <Sidebar />

      <main className="main-content">

        {/* Navbar */}
        <Navbar />

        <div className="dashboard-content">

          {/* Welcome */}
          <section className="welcome-section">
            <h1>Welcome back, Suguna! 👋</h1>

            <p>
              Manage and securely share your files from the cloud.
            </p>
          </section>


          {/* Statistics */}
          <section className="stats-grid">

            <StatCard
              icon="📁"
              title="My Files"
              value="24"
              subtitle="Total Files"
            />

            <StatCard
              icon="👥"
              title="Shared"
              value="8"
              subtitle="Shared Files"
            />

            <StatCard
              icon="☁️"
              title="Storage"
              value="2.4 / 10 GB"
              subtitle="24% Used"
            />

          </section>


          {/* Search and Upload */}
          <section className="file-controls">

            <div className="search-box">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search files..."
              />

            </div>

            <button
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              ⬆️ Upload File
            </button>

          </section>


          {/* Recent Files */}
          <FileTable />


          {/* Quick Actions */}
          <QuickActions
            onUpload={() => setShowUploadModal(true)}
          />

        </div>

      </main>


      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
        />
      )}

    </div>
  );
}

export default Dashboard;