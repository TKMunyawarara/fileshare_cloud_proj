import React, { useState } from "react";

function ShareModal({ fileName, onClose, onShare }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("View");
  const [sharing, setSharing] = useState(false);

  const handleShareClick = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    setSharing(true);
    try {
      if (onShare) {
        await onShare(email.trim(), permission);
      }
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="share-modal"
        style={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
          colorScheme: "light", // Forces browser inputs into light mode
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2 style={{ color: "#0f172a", margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>
              Share File
            </h2>
            <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "0.875rem" }}>
              Share this file with another user by email.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={sharing}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* File Info Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            backgroundColor: "#f8fafc",
            padding: "0.875rem 1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            marginBottom: "1.25rem",
          }}
        >
          <span style={{ fontSize: "1.75rem" }}>📄</span>
          <div>
            <strong style={{ color: "#0f172a", display: "block", fontSize: "0.95rem" }}>
              {fileName}
            </strong>
            <span style={{ color: "#64748b", fontSize: "0.8rem" }}>SecureShare File</span>
          </div>
        </div>

        <form onSubmit={handleShareClick}>
          {/* Email Input */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="share-email-input"
              style={{
                display: "block",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Recipient Email Address
            </label>

            <input
              id="share-email-input"
              type="email"
              autoFocus
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sharing}
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#ffffff",
                color: "#000000", // High contrast black text
                border: "2px solid #6366f1", // Visible purple border
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
                pointerEvents: "auto",
              }}
            />
          </div>

          {/* Permission Dropdown */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Permission Level
            </label>

            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              disabled={sharing}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <option value="View">View (Read Only)</option>
              <option value="Edit">Edit (Full Access)</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={sharing}
              style={{
                padding: "0.625rem 1.25rem",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={sharing}
              style={{
                padding: "0.625rem 1.25rem",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: sharing ? "not-allowed" : "pointer",
                opacity: sharing ? 0.7 : 1,
              }}
            >
              {sharing ? "Sharing... ☁️" : "👥 Share File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShareModal;