import React, { useState } from "react";

function ShareModal({ fileName, onClose, onShare }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("View");
  const [sharing, setSharing] = useState(false);

  const handleShareClick = async () => {
    if (!email.trim()) {
      alert("Please enter an email address.");
      return;
    }

    setSharing(true);
    try {
      if (onShare) {
        await onShare(email.trim(), permission);
      }
    } catch (err) {
      console.error("Share modal error:", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="share-modal">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ color: "#0f172a", margin: 0 }}>Share File</h2>
            <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
              Share this file with another user by email.
            </p>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
            disabled={sharing}
          >
            ✕
          </button>
        </div>

        {/* File Info */}
        <div className="share-file-info">
          <span className="share-file-icon">📄</span>
          <div>
            <strong style={{ color: "#0f172a" }}>{fileName}</strong>
            <p style={{ color: "#64748b", margin: 0 }}>SecureShare File</p>
          </div>
        </div>

        {/* Email Address Input */}
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", color: "#334155", fontWeight: "600", marginBottom: "6px" }}>
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter recipient's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sharing}
            style={{
              width: "100%",
              padding: "0.625rem 0.875rem",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Permission Dropdown */}
        <div className="form-group" style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", color: "#334155", fontWeight: "600", marginBottom: "6px" }}>
            Permission
          </label>

          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            disabled={sharing}
            style={{
              width: "100%",
              padding: "0.625rem 0.875rem",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="View">View</option>
            <option value="Edit">Edit</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={sharing}
          >
            Cancel
          </button>

          <button
            className="modal-upload-btn"
            onClick={handleShareClick}
            disabled={sharing}
            style={{
              opacity: sharing ? 0.7 : 1,
              cursor: sharing ? "not-allowed" : "pointer",
            }}
          >
            {sharing ? "Sharing... ☁️" : "👥 Share File"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ShareModal;