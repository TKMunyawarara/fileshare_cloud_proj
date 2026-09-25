import React, { useState } from "react";

function RenameModal({ fileName, onClose, onRename }) {
  const [newName, setNewName] = useState(fileName);

  const handleRename = () => {
    if (!newName.trim()) {
      alert("Please enter a file name.");
      return;
    }

    onRename(newName.trim());
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="rename-modal">

        <div className="modal-header">
          <div>
            <h2>Rename File</h2>
            <p>Enter a new name for this file.</p>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="rename-file-info">
          <span className="rename-file-icon">📄</span>
          <span>{fileName}</span>
        </div>

        <div className="form-group">
          <label>New File Name</label>

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new file name"
            autoFocus
          />
        </div>

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="modal-upload-btn"
            onClick={handleRename}
          >
            ✏️ Rename
          </button>

        </div>

      </div>
    </div>
  );
}

export default RenameModal;