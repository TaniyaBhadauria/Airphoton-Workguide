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
  const [reviewerComment, setReviewerComment] = useState<string>("");
  const [reviewerComments, setReviewerComments] = useState<{ reviewer: string; reviewer_comment: string }[]>([]);

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

  const handleViewMore =  async (feedback: FeedbackData) => {
    setSelectedFeedback(feedback);
    setIsPopupOpen(true);
     try {
        const res = await fetch(`https://y-eta-lemon.vercel.app/get_feedback_comments/${feedback.id}`);
        const comments = await res.json();
        setReviewerComments(comments);
      } catch (error) {
        console.error("Error fetching reviewer comments:", error);
        setReviewerComments([]);
      }
  };

  const handleSubmitComment = async () => {
    if (!selectedFeedback) return;

    const reviewer_name = localStorage.getItem("username") || "Anonymous";

    try {
      const response = await fetch("https://y-eta-lemon.vercel.app/add_feedback_comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          feedback_id: selectedFeedback.id,
          reviewer: reviewer_name,
          reviewer_comment: reviewerComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      alert("Comment submitted successfully");
      setReviewerComment(""); // clear after submit
      // 👇 Fetch updated reviewer comments
      await handleViewMore(selectedFeedback);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    }
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
            <div className={styles.reviewerCommentsSection}>
              <h4>Reviewer Comments</h4>
              {reviewerComments.length > 0 ? (
                reviewerComments.map((comment, index) => (
                  <div key={index} className={styles.reviewerComment}>
                    <strong>{comment.reviewer}:</strong> {comment.reviewer_comment}
                  </div>
                ))
              ) : (
                <p>No reviewer comments yet.</p>
              )}
            </div>


            <div className={styles.commentBox}>
              <h4>Add Reviewer Comment</h4>
              <textarea
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder="Enter your comment"
                className={styles.commentInput}
              />
              <button className={styles.submitCommentButton} onClick={handleSubmitComment}>
                Submit Comment
              </button>
            </div>
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
            </a>
          </div>
    </div>
  );
};

export default VersionTable;
