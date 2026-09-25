import React, { useRef, useState } from "react";

function UploadModal({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    alert(`${selectedFile.name} is ready to upload.`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">

        <div className="modal-header">
          <div>
            <h2>Upload File</h2>
            <p>Select a file to upload to SecureShare.</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Upload Area */}
        <div className="upload-area">

          <div className="upload-icon">☁️</div>

          {selectedFile ? (
            <>
              <h3>{selectedFile.name}</h3>
              <p>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
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
          />

          <button
            type="button"
            className="choose-file-btn"
            onClick={handleChooseFile}
          >
            📁 Choose File
          </button>

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
            onClick={handleUpload}
          >
            ⬆️ Upload File
          </button>
        </div>

      </div>
    </div>
  );
}

export default UploadModal;