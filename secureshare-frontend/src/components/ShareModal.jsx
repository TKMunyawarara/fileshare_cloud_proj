import React, { useState } from "react";

function ShareModal({ fileName, onClose }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("View");

  const handleShare = () => {
  if (!email) {
    alert("Please enter an email address.");
    return;
  }
  // Call the new onShare callback passed from MyFiles.jsx
  if (onShare) {
    onShare(email, permission);
  }
};

  return (
    <div className="modal-overlay">
      <div className="share-modal">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Share File</h2>
            <p>Share this file with another user.</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* File */}
        <div className="share-file-info">
          <span className="share-file-icon">📄</span>

          <div>
            <strong>{fileName}</strong>
            <p>SecureShare File</p>
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter user's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Permission */}
        <div className="form-group">
          <label>Permission</label>

          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            <option value="View">View</option>
            <option value="Edit">Edit</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="modal-upload-btn"
            onClick={handleShare}
          >
            👥 Share File
          </button>

        </div>

      </div>
    </div>
  );
}

export default ShareModal;