import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getSharedFiles, downloadFile } from "../api";

function SharedFiles() {
  const [search, setSearch] = useState("");
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharedFiles();
  }, []);

  const loadSharedFiles = async () => {
    setLoading(true);
    try {
      const res = await getSharedFiles();
      setSharedFiles(res.data);
    } catch (err) {
      console.error("Error loading shared files:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = sharedFiles.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (fileId) => {
    try {
      const res = await downloadFile(fileId);
      window.open(res.data.url, "_blank");
    } catch (err) {
      alert("Download failed.");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-container">
          <div className="page-header">
            <div>
              <h1>Shared With Me</h1>
              <p>Files that other users have shared with you.</p>
            </div>
          </div>

          <div className="myfiles-controls">
            <div className="search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search shared files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="file-count">
            <h3>Shared Files</h3>
            <span>{filteredFiles.length} files</span>
          </div>

          <div className="myfiles-table-container">
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                Loading shared files... ☁️
              </div>
            ) : (
              <table className="file-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Shared By</th>
                    <th>Permission</th>
                    <th>Size</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <tr key={file.id}>
                        <td>
                          <div className="file-name">
                            <span className="file-icon">{file.icon}</span>
                            <span>{file.name}</span>
                          </div>
                        </td>
                        <td>{file.sharedBy}</td>
                        <td>
                          <span
                            className={
                              file.permission === "Edit"
                                ? "permission edit"
                                : "permission view"
                            }
                          >
                            {file.permission}
                          </span>
                        </td>
                        <td>{file.size}</td>
                        <td>{file.date}</td>
                        <td>
                          <button
                            className="download-btn"
                            title="Download"
                            onClick={() => handleDownload(file.id)}
                          >
                            ⬇️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-files">
                        No shared files found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SharedFiles;