import React, { useEffect, useState } from "react";
import styles from "./VersionTable.module.css";
import style from "../styles.module.css";

// Define TypeScript interface for Feedback API response
interface FeedbackData {
  id: number;
  feedback_type: string;
  comment: string;
  experience_rating: number;
  additional_comments: string;
  created_at: string;
  status: string;
  file_upload?: string; // Base64-encoded image
}

const VersionTable: React.FC = () => {
  const [tableData, setTableData] = useState<FeedbackData[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("https://y-eta-lemon.vercel.app/api/feedback");
        const data: FeedbackData[] = await response.json();

        setTableData(data);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedback();
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

  const handleViewMore = (feedback: FeedbackData) => {
    setSelectedFeedback(feedback);
    setIsPopupOpen(true);
  };

  const handleResolve = async (comment: string) => {
    try {
      const response = await fetch("https://y-eta-lemon.vercel.app/update_feedback_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }), // Send the comment to match feedback entry
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Refresh feedback data after updating status
      const updatedFeedback = tableData.map((item) =>
        item.comment === comment ? { ...item, status: "Resolved" } : item
      );

      setTableData(updatedFeedback);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error resolving feedback:", error);
    }
  };

  return (
    <div>
      <table className={styles.versionTable}>
        <thead>
          <tr>
            <th className={styles.header}>User</th>
            <th className={styles.header}>Date</th>
            <th className={styles.header}>Category</th>
            <th className={styles.header}>Message</th>
            <th className={styles.header}>Status</th>
            <th className={styles.header}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td className={styles.cell}>User {row.id}</td>
              <td className={styles.cell}>{new Date(row.created_at).toLocaleString()}</td>
              <td className={styles.cell}>{row.feedback_type}</td>
              <td className={styles.cell}>{row.comment}</td>
              <td className={styles.cell}>{row.status}</td>
              <td className={styles.actionCell}>
                <button className={styles.compareButton} onClick={() => handleViewMore(row)}>
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup to show additional feedback details */}
      {selectedFeedback && isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>Feedback Details</h3>
            <p><strong>Category:</strong> {selectedFeedback.feedback_type}</p>
            <p><strong>Comment:</strong> {selectedFeedback.comment}</p>
            <p><strong>Experience Rating:</strong> {selectedFeedback.experience_rating} / 5</p>
            <p><strong>Additional Comments:</strong> {selectedFeedback.additional_comments || "N/A"}</p>

            {/* Display Image if Available */}
            {selectedFeedback.file_upload && (
              <div className={styles.imageContainer}>
                <p><strong>Uploaded Image:</strong></p>
                <img
                  src={`data:image/png;base64,${selectedFeedback.file_upload}`}
                  alt="Uploaded Feedback"
                  className={styles.uploadedImage}
                />
              </div>
            )}

            <button className={styles.closeButton} onClick={() => handleResolve(selectedFeedback.comment)}>
              Resolve
            </button>
            <button className={styles.closeButton} onClick={() => setIsPopupOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Blur effect when the popup is open */}
      {isPopupOpen && <div className={styles.backgroundBlur} />}
      <hr className={styles.divider} />
      <div className={styles.summary}>
            <span className={styles.resultCount}>{tableData.length} Search Results</span>
            <a href="#" className={styles.moreLink}>
              <span>Show me more results</span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/809a93c48a988bdddd7aaf5798dcdf7f8cc556a8?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"
                alt="Show more"
                className={styles.moreIcon}
              />
            </a>
          </div>
    </div>
  );
};

export default VersionTable;
