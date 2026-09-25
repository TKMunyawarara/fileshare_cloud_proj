import React from "react";

function FileTable() {
  const files = [
    {
      name: "Resume.pdf",
      icon: "📄",
      size: "2.4 MB",
      date: "Aug 11, 2026",
      type: "PDF",
    },
    {
      name: "Project.pdf",
      icon: "📄",
      size: "4.8 MB",
      date: "Aug 10, 2026",
      type: "PDF",
    },
    {
      name: "Photo.jpg",
      icon: "🖼️",
      size: "1.2 MB",
      date: "Aug 09, 2026",
      type: "Image",
    },
    {
      name: "Report.xlsx",
      icon: "📊",
      size: "850 KB",
      date: "Aug 08, 2026",
      type: "Excel",
    },
  ];

  return (
    <div className="file-table-container">
      <div className="section-title">
        <h3>Recent Files</h3>
        <button className="view-all-btn">View All</button>
      </div>

      <div className="table-wrapper">
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
            {files.map((file, index) => (
              <tr key={index}>
                <td>
                  <div className="file-name">
                    <span className="file-icon">{file.icon}</span>
                    <span>{file.name}</span>
                  </div>
                </td>

                <td>{file.type}</td>

                <td>{file.size}</td>

                <td>{file.date}</td>

                <td>
                  <button className="action-btn">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileTable;