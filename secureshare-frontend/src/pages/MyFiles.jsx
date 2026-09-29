import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UploadModal from "../components/UploadModal";
import ShareModal from "../components/ShareModal";
import RenameModal from "../components/RenameModal";
import DeleteModal from "../components/DeleteModal";

// Import our API bridge
import { 
  getMyFiles, 
  downloadFile, 
  renameFile, 
  deleteFile, 
  uploadFile, 
  shareFile 
} from "../api";

function MyFiles() {
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  // 1. Fetch files from Backend on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await getMyFiles();
      setFiles(response.data);
    } catch (err) {
      console.error("Error fetching files:", err);
      alert("Failed to load files from server.");
    } finally {
      setLoading(false);
    }
  };

  // Filter files based on user search input
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  // 2. Download File Handler
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await downloadFile(fileId);
      const s3PresignedUrl = response.data.url;
      
      // Open the file in a new tab to trigger download safely
      window.open(s3PresignedUrl, "_blank");
    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not retrieve file download link.");
    }
  };

  // 3. Upload File Handler (Passed into UploadModal)
  const handleUpload = async (fileToUpload) => {
  try {
    await uploadFile(fileToUpload);
    alert("File uploaded successfully to Azure Blob Storage! ☁️");  // 👈 fixed
    fetchFiles();
    setShowUploadModal(false);
  } catch (err) {
    console.error("Upload error:", err);
    alert(err.response?.data?.error || "Upload failed");
  }
};

  // 4. Rename File Handler
  const handleRenameClick = (file) => {
    setSelectedFile(file);
    setShowRenameModal(true);
  };

  const handleRename = async (newName) => {
    try {
      await renameFile(selectedFile.id, newName);
      alert("File renamed successfully.");
      fetchFiles(); // Refresh list
    } catch (err) {
      console.error("Rename error:", err);
      alert("Failed to rename file.");
    }
  };

  // 5. Delete File Handler
  const handleDeleteClick = (file) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteFile(selectedFile.id);
      alert("File deleted successfully from Cloud Storage.");
      fetchFiles(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete file.");
    }
  };

  // 6. Share File Handler (Passed into ShareModal)
  const handleShareClick = (file) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };

  const handleShare = async (email, permission) => {
    try {
      await shareFile(selectedFile.id, email, permission);
      alert(`Successfully shared file with ${email}!`);
      setShowShareModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Share error:", err);
      alert(err.response?.data?.error || "Failed to share file.");
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <Sidebar />

      <main className="main-content">
        {/* Navbar */}
        <Navbar />

        <div className="page-container">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h1>My Files</h1>
              <p>Manage all your files stored in SecureShare.</p>
            </div>

            <button
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              ⬆️ Upload File
            </button>
          </div>

          {/* Search */}
          <div className="myfiles-controls">
            <div className="search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* File Count */}
          <div className="file-count">
            <h3>All Files</h3>
            <span>{filteredFiles.length} files</span>
          </div>

          {/* File Table */}
          <div className="myfiles-table-container">
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                Loading cloud files... ☁️
              </div>
            ) : (
              <table className="file-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <tr key={file.id}>
                        {/* File Name */}
                        <td>
                          <div className="file-name">
                            <span className="file-icon">{file.icon}</span>
                            <span>{file.name}</span>
                          </div>
                        </td>

                        {/* Type */}
                        <td>{file.type}</td>

                        {/* Size */}
                        <td>{file.size}</td>

                        {/* Date */}
                        <td>{file.date}</td>

                        {/* Actions */}
                        <td>
                          <div className="file-actions">
                            {/* Download */}
                            <button
                              className="download-btn"
                              title="Download"
                              onClick={() => handleDownload(file.id, file.name)}
                            >
                              ⬇️
                            </button>

                            {/* Share */}
                            <button
                              className="action-icon-btn"
                              title="Share"
                              onClick={() => handleShareClick(file)}
                            >
                              👥
                            </button>

                            {/* Rename */}
                            <button
                              className="action-icon-btn"
                              title="Rename"
                              onClick={() => handleRenameClick(file)}
                            >
                              ✏️
                            </button>

                            {/* Delete */}
                            <button
                              className="delete-icon-btn"
                              title="Delete"
                              onClick={() => handleDeleteClick(file)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-files">
                        No files found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload} // Now handles real file upload
        />
      )}

      {/* Share Modal */}
      {showShareModal && selectedFile && (
        <ShareModal
          fileName={selectedFile.name}
          onClose={() => {
            setShowShareModal(false);
            setSelectedFile(null);
          }}
          onShare={handleShare} // Now handles real sharing
        />
      )}

      {/* Rename Modal */}
      {showRenameModal && selectedFile && (
        <RenameModal
          fileName={selectedFile.name}
          onClose={() => {
            setShowRenameModal(false);
            setSelectedFile(null);
          }}
          onRename={handleRename}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedFile && (
        <DeleteModal
          fileName={selectedFile.name}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedFile(null);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default MyFiles;