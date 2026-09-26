import React, { useRef, useState } from "react";

function UploadModal({ onClose, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    if (!onUpload) {
      alert("Upload function not configured.");
      return;
    }

    setUploading(true);
    try {
      // Calls the real API upload handler from Dashboard or MyFiles
      await onUpload(selectedFile);
    } catch (error) {
      console.error("Upload error in modal:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Upload File</h2>
            <p>Select a file to upload to SecureShare.</p>
          </div>

          <button className="close-btn" onClick={onClose} disabled={uploading}>
            ✕
          </button>
        </div>

        {/* Upload Area */}
        <div className="upload-area">
          <div className="upload-icon">☁️</div>

          {selectedFile ? (
            <>
              <h3>{selectedFile.name}</h3>
              <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <h3>Choose a file to upload</h3>
              <p>Click the button below to select a file</p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="choose-file-btn"
            onClick={handleChooseFile}
            disabled={uploading}
          >
            📁 {selectedFile ? "Change File" : "Choose File"}
          </button>
        </div>

        {/* Buttons */}
        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            className="modal-upload-btn"
            onClick={handleUploadClick}
            disabled={uploading || !selectedFile}
            style={{
              opacity: uploading || !selectedFile ? 0.6 : 1,
              cursor: uploading || !selectedFile ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading... ☁️" : "⬆️ Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;