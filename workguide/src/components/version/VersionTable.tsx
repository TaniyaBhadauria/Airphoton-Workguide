"use client";
import React, { useEffect, useState } from "react";
import styles from "./VersionTable.module.css";
import stylesBar from "./SearchBar.module.css";

// Define TypeScript interfaces
interface FileChange {
  filename: string;
  changes: string;
}

interface CommitData {
  sha: string;
  message: string;
  author: string;
  date: string;
  files: FileChange[];
}

interface TableRow {
  date: string;
  version: string;
  author: string;
  message: string;
  files: FileChange[];
}

const VersionTable: React.FC = () => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<TableRow | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileChange | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isFileChangesPopupOpen, setIsFileChangesPopupOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoOwner = "TaniyaBhadauria";
        const repoName = "apps-wi";
        const numCommits = 10;
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=${numCommits}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error fetching commits: ${response.status}`);
        }

        const commits = await response.json();
        const commitInfo: CommitData[] = [];

        for (let commit of commits) {
          const commitData = {
            sha: commit.sha.slice(0, 7),
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
            files: [],
          };

          const commitResponse = await fetch(commit.url);
          if (commitResponse.ok) {
            const commitDetails = await commitResponse.json();
            if (commitDetails.files) {
              commitData.files = commitDetails.files.map((file: any) => ({
                filename: file.filename,
                changes: file.patch || "No diff available",
              }));
            }
          }

          commitInfo.push(commitData);
        }

        const formattedData: TableRow[] = commitInfo.map((commit, index) => ({
          date: new Date(commit.date).toLocaleString(),
          version: `v.${(index + 1).toString().padStart(2, "0")}`,
          author: commit.author,
          message: commit.message,
          files: commit.files,
        }));

        setTableData(formattedData);
      } catch (error) {
        console.error("Error fetching commit data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add(styles.bodyBlur);
    } else {
      document.body.classList.remove(styles.bodyBlur);
    }

    return () => {
      document.body.classList.remove(styles.bodyBlur);
    };
  }, [isPopupOpen]);

  const handleViewFileChanges = (file: FileChange) => {
    setSelectedFile(file);
    setIsFileChangesPopupOpen(true);
  };

  const handleCardClick = (commit: TableRow) => {
    setSelectedCommit(commit);
    setIsPopupOpen(true);
  };

  const filteredData = tableData.filter((row) =>
    row.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className={stylesBar.searchBarContainer}>
        <div className={stylesBar.searchInput}>

          <input
            type="text"
            className="form-control"
            placeholder="Search by author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className={stylesBar.searchButton}>Search</button>
      </div>

      {/* Version Table */}
      <table className={styles.versionTable}>
        <thead>
          <tr>
            <th className={styles.header}>Date</th>
            <th className={styles.header}>Version</th>
            <th className={styles.header}>Author</th>
            <th className={styles.header}>Commit Message</th>
            <th className={styles.header}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td className={styles.cell}>{row.date}</td>
              <td className={styles.cell}>{row.version}</td>
              <td className={styles.cell}>{row.author}</td>
              <td className={styles.cell}>{row.message}</td>
              <td className={styles.actionCell}>
                <button
                  className={styles.compareButton}
                  onClick={() => handleCardClick(row)}
                >
                  Compare Changes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* File List Popup */}
      {selectedCommit && isPopupOpen && (
        <div className={styles.popupcard}>
          <div className={styles.popupContent}>
            <h3>Changed Files</h3>
            <div className={styles.fileList}>
              {selectedCommit.files.map((file, index) => (
                <div className={styles.fileRow} key={index}>
                  <div className={styles.fileName}>{file.filename}</div>
                  <div className={styles.viewButton}>
                    <button
                      className={styles.viewChangesButton}
                      onClick={() => handleViewFileChanges(file)}
                    >
                      View Changes
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsPopupOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* File Changes Popup */}
      {isFileChangesPopupOpen && selectedFile && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>Changes in {selectedFile.filename}</h3>
            <pre className={styles.diffBox}>{selectedFile.changes}</pre>
            <button
              className={styles.closeButton}
              onClick={() => setIsFileChangesPopupOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isPopupOpen && <div className={styles.backgroundBlur} />}

      <hr className={styles.divider} />
      <div className={styles.summary}>
        <span className={styles.resultCount}>
          {filteredData.length} Search Results
        </span>
        <a href="#" className={styles.moreLink}>
        </a>
      </div>
    </div>
  );
};

export default VersionTable;
