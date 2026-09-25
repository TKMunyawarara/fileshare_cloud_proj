import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function SharedFiles() {

  const [search, setSearch] = useState("");

  const sharedFiles = [
    {
      id: 1,
      name: "Cloud_Project.pdf",
      icon: "📄",
      sharedBy: "Rahul",
      permission: "View",
      size: "4.8 MB",
      date: "Aug 10, 2026",
    },

    {
      id: 2,
      name: "Project_Report.docx",
      icon: "📝",
      sharedBy: "Priya",
      permission: "Edit",
      size: "2.1 MB",
      date: "Aug 09, 2026",
    },

    {
      id: 3,
      name: "Presentation.pptx",
      icon: "📊",
      sharedBy: "Kiran",
      permission: "View",
      size: "6.2 MB",
      date: "Aug 08, 2026",
    },

    {
      id: 4,
      name: "Team_Photo.jpg",
      icon: "🖼️",
      sharedBy: "Anjali",
      permission: "View",
      size: "1.5 MB",
      date: "Aug 07, 2026",
    },
  ];


  const filteredFiles = sharedFiles.filter((file) =>
    file.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const handleDownload = (fileName) => {
    alert(`${fileName} download started.`);
  };


  return (

    <div className="dashboard">

      {/* SIDEBAR */}

      <Sidebar />


      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* NAVBAR */}

        <Navbar />


        {/* PAGE CONTENT */}

        <div className="page-container">

          {/* HEADER */}

          <div className="page-header">

            <div>

              <h1>
                Shared With Me
              </h1>

              <p>
                Files that other users have shared with you.
              </p>

            </div>

          </div>


          {/* SEARCH */}

          <div className="myfiles-controls">

            <div className="search-box">

              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder="Search shared files..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* TITLE + COUNT */}

          <div className="file-count">

            <h3>
              Shared Files
            </h3>

            <span>
              {filteredFiles.length} files
            </span>

          </div>


          {/* TABLE */}

          <div className="myfiles-table-container">

            <table className="file-table">

              <thead>

                <tr>

                  <th>
                    File Name
                  </th>

                  <th>
                    Shared By
                  </th>

                  <th>
                    Permission
                  </th>

                  <th>
                    Size
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredFiles.length > 0 ? (

                  filteredFiles.map((file) => (

                    <tr key={file.id}>

                      {/* FILE NAME */}

                      <td>

                        <div className="file-name">

                          <span className="file-icon">
                            {file.icon}
                          </span>

                          <span>
                            {file.name}
                          </span>

                        </div>

                      </td>


                      {/* SHARED BY */}

                      <td>
                        {file.sharedBy}
                      </td>


                      {/* PERMISSION */}

                      <td>

                        <span
                          className={
                            file.permission === "Edit"
                              ? "permission edit"
                              : "permission view"
                          }
                        >
                          {file.permission}
                        </span>

                      </td>


                      {/* SIZE */}

                      <td>
                        {file.size}
                      </td>


                      {/* DATE */}

                      <td>
                        {file.date}
                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          className="download-btn"
                          title="Download"
                          onClick={() =>
                            handleDownload(file.name)
                          }
                        >
                          ⬇️
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="no-files"
                    >
                      No shared files found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default SharedFiles;