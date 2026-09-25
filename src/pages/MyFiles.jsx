import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UploadModal from "../components/UploadModal";
import ShareModal from "../components/ShareModal";
import RenameModal from "../components/RenameModal";
import DeleteModal from "../components/DeleteModal";

function MyFiles() {
  const [search, setSearch] = useState("");

  const [files, setFiles] = useState([
    {
      id: 1,
      name: "Resume.pdf",
      icon: "📄",
      type: "PDF",
      size: "2.4 MB",
      date: "Aug 11, 2026",
    },
    {
      id: 2,
      name: "Cloud_Project.pdf",
      icon: "📄",
      type: "PDF",
      size: "4.8 MB",
      date: "Aug 10, 2026",
    },
    {
      id: 3,
      name: "Photo.jpg",
      icon: "🖼️",
      type: "Image",
      size: "1.2 MB",
      date: "Aug 09, 2026",
    },
    {
      id: 4,
      name: "Report.xlsx",
      icon: "📊",
      type: "Excel",
      size: "850 KB",
      date: "Aug 08, 2026",
    },
    {
      id: 5,
      name: "Presentation.pptx",
      icon: "📊",
      type: "PowerPoint",
      size: "6.2 MB",
      date: "Aug 07, 2026",
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  // Download
  const handleDownload = (fileName) => {
    alert(`${fileName} download started.`);
  };

  // Share
  const handleShareClick = (file) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };

  // Rename
  const handleRenameClick = (file) => {
    setSelectedFile(file);
    setShowRenameModal(true);
  };

  const handleRename = (newName) => {
    setFiles(
      files.map((file) =>
        file.id === selectedFile.id
          ? { ...file, name: newName }
          : file
      )
    );

    alert("File renamed successfully.");
  };

  // Delete
  const handleDeleteClick = (file) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setFiles(
      files.filter((file) => file.id !== selectedFile.id)
    );

    alert("File deleted successfully.");
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
              <p>
                Manage all your files stored in SecureShare.
              </p>
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

                          <span className="file-icon">
                            {file.icon}
                          </span>

                          <span>
                            {file.name}
                          </span>

                        </div>
                      </td>

                      {/* Type */}
                      <td>
                        {file.type}
                      </td>

                      {/* Size */}
                      <td>
                        {file.size}
                      </td>

                      {/* Date */}
                      <td>
                        {file.date}
                      </td>

                      {/* Actions */}
                      <td>

                        <div className="file-actions">

                          {/* Download */}
                          <button
                            className="download-btn"
                            title="Download"
                            onClick={() =>
                              handleDownload(file.name)
                            }
                          >
                            ⬇️
                          </button>

                          {/* Share */}
                          <button
                            className="action-icon-btn"
                            title="Share"
                            onClick={() =>
                              handleShareClick(file)
                            }
                          >
                            👥
                          </button>

                          {/* Rename */}
                          <button
                            className="action-icon-btn"
                            title="Rename"
                            onClick={() =>
                              handleRenameClick(file)
                            }
                          >
                            ✏️
                          </button>

                          {/* Delete */}
                          <button
                            className="delete-icon-btn"
                            title="Delete"
                            onClick={() =>
                              handleDeleteClick(file)
                            }
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="5"
                      className="no-files"
                    >
                      No files found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
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