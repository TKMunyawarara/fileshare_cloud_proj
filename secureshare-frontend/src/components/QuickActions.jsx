import React from "react";
import { useNavigate } from "react-router-dom";

function QuickActions({ onUpload }) {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>

      <div className="quick-action-buttons">

        {/* Upload */}
        <button
          className="quick-btn upload-btn"
          onClick={onUpload}
        >
          ⬆️ Upload File
        </button>

        {/* My Files */}
        <button
          className="quick-btn"
          onClick={() => navigate("/my-files")}
        >
          📁 My Files
        </button>

        {/* Shared Files */}
        <button
          className="quick-btn"
          onClick={() => navigate("/shared-files")}
        >
          👥 Shared Files
        </button>

      </div>
    </div>
  );
}

export default QuickActions;