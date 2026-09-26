import React from "react";

function FileTable({ files = [], loading = false }) {
  if (loading) {
    return (
      <div className="file-table-container" style={{ padding: "2rem", textAlign: "center" }}>
        Loading files... ☁️
      </div>
    );
  }

  return (
    <div className="file-table-container">
      <div className="section-title">
        <h3>Recent Files</h3>
      </div>

      <div className="table-wrapper">
        <table className="file-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {files.length > 0 ? (
              files.map((file) => (
                <tr key={file.id}>
                  <td>
                    <div className="file-name">
                      <span className="file-icon">{file.icon}</span>
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td>{file.type}</td>
                  <td>{file.size}</td>
                  <td>{file.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-files" style={{ textAlign: "center", padding: "2rem" }}>
                  No recent files uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileTable;