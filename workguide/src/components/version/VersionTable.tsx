import React, { useEffect, useState } from "react";
import styles from "./VersionTable.module.css";

// Define TypeScript interfaces for API response
interface FileChange {
  filename: string;
  changes: string;
}

interface CommitData {
  author: string;
  message: string;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/commits?repo_owner=TaniyaBhadauria&repo_name=apps-wi&token=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"
        );
        const data: CommitData[] = await response.json();

        // Transform API data to match table format
        const formattedData: TableRow[] = data.map((commit: CommitData, index: number) => ({
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
        document.body.classList.add(styles.bodyBlur);  // Apply blur effect to body
      } else {
        document.body.classList.remove(styles.bodyBlur);  // Remove blur effect from body
      }

      return () => {
        document.body.classList.remove(styles.bodyBlur); // Cleanup the blur effect when component unmounts or popup is closed
      };
    }, [isPopupOpen]);

  const handleViewFileChanges = (file: FileChange) => {
    setSelectedFile(file);
    setIsFileChangesPopupOpen(true); // Open file changes popup
  };

  const handleCardClick = (commit: TableRow) => {
    setSelectedCommit(commit);
    setIsPopupOpen(true); // Open file selection popup
  };

  return (
    <div>
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
          {tableData.map((row, index) => (
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

      {/* If a commit is selected, show the card with file names */}
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
         <button className={styles.closeButton} onClick={() => setIsPopupOpen(false)}>
           Close
         </button>
       </div>
     </div>
      )}

      {/* If the file changes popup is open */}
      {isFileChangesPopupOpen && selectedFile && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>Changes in {selectedFile.filename}</h3>
            <pre className={styles.diffBox}>{selectedFile.changes}</pre>
            <button className={styles.closeButton} onClick={() => setIsFileChangesPopupOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Blur the background when the popup is open */}
      {isPopupOpen && <div className={styles.backgroundBlur} />}
    </div>
  );
};

export default VersionTable;
