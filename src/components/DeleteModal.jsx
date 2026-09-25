import React from "react";

function DeleteModal({ fileName, onClose, onDelete }) {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="delete-modal">

        <div className="delete-icon">
          🗑️
        </div>

        <h2>Delete File?</h2>

        <p>
          Are you sure you want to delete
          <strong> {fileName}</strong>?
        </p>

        <p className="delete-warning">
          This action cannot be undone.
        </p>

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="delete-confirm-btn"
            onClick={handleDelete}
          >
            🗑️ Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default DeleteModal;