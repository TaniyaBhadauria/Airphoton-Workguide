import * as React from "react";
import styles from "./FeedbackForm.module.css";

type ExperienceRating =
  | "very-dissatisfied"
  | "dissatisfied"
  | "neutral"
  | "satisfied"
  | "very-satisfied"
  | null;

const FeedbackForm: React.FC = () => {
  const [feedbackType, setFeedbackType] = React.useState("Bug");
  const [comment, setComment] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [experience, setExperience] = React.useState<number | null>(null);
  const [suggestion, setSuggestion] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null); // New state for success message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData to handle the file and other inputs
    const formData = new FormData();
    formData.append("feedback_type", feedbackType);
    formData.append("comment", comment);
    if (file) formData.append("file_upload", file);
    formData.append("experience_rating", experience?.toString() || "");
    formData.append("additional_comments", suggestion);
    formData.append("status", "Open");

    // Call the Flask API to submit the feedback
    try {
      const response = await fetch("http://127.0.0.1:5000/submit_feedback", {
        method: "POST",
        body: formData, // Form data including the file
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Feedback submitted successfully:", result);
        setSuccessMessage("Thank you for your feedback!"); // Set success message on success
        // Optionally, you can reset the form fields after successful submission
        setFeedbackType("Bug");
        setComment("");
        setFile(null);
        setExperience(null);
        setSuggestion("");
      } else {
        console.error("Failed to submit feedback");
        setSuccessMessage("Failed to submit feedback. Please try again."); // Set failure message on error
      }
    } catch (error) {
      console.error("Error while submitting feedback:", error);
      setSuccessMessage("Error while submitting feedback. Please try again later.");
    }
  };

  const handleStarClick = (rating: number) => {
    setExperience(rating);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.feedbackModal}>
      <header className={styles.modalHeader}>
        <i className={styles.backIcon} aria-hidden="true" />
        <h1 className={styles.modalTitle}>Feedback</h1>
      </header>

      {/* Success message */}
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      <section className={styles.inputSection}>
        <label className={styles.inputLabel}>Feedback Type</label>
        <input
          type="text"
          className={styles.inputField}
          value={feedbackType}
          onChange={(e) => setFeedbackType(e.target.value)}
          aria-label="Feedback Type"
        />
      </section>

      <section className={styles.inputSection}>
        <label className={styles.inputLabel}>Comment Box</label>
        <textarea
          className={styles.inputField}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add"
          aria-label="Comment Box"
        />
      </section>

      <section className={styles.inputSection}>
        <label className={styles.inputLabel}>File Upload</label>
        <input
          type="file"
          className={styles.inputField}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          aria-label="File Upload"
        />
      </section>

      <section className={styles.inputSection}>
        <label className={styles.inputLabel}>How was your experience?</label>
        <div className={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <span
              key={rating}
              className={`${styles.star} ${rating <= (experience || 0) ? styles.selected : ""}`}
              onClick={() => handleStarClick(rating)}
              role="button"
              tabIndex={0}
            >
              ★
            </span>
          ))}
        </div>
        <p className={styles.emojiHelperText}>Choose your experience</p>
      </section>

      <section className={styles.suggestionSection}>
        <input
          type="text"
          className={styles.suggestionInput}
          placeholder="Suggest anything we can improve.."
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          aria-label="Suggestions"
        />
      </section>

      <button type="submit" className={styles.submitButton}>
        Send Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
