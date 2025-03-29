"use client";

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
  const [experience, setExperience] = React.useState<ExperienceRating>(null);
  const [suggestion, setSuggestion] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      feedbackType,
      comment,
      file,
      experience,
      suggestion,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.feedbackModal}>
      <header className={styles.modalHeader}>
        <i className={styles.backIcon} aria-hidden="true" />
        <h1 className={styles.modalTitle}>Feedback</h1>
      </header>

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
        <div className={styles.emojiContainer}>
          <img
            src="emoji-1.png"
            alt="Very Dissatisfied"
            className={styles.emojiButton}
            onClick={() => setExperience("very-dissatisfied")}
            role="button"
            tabIndex={0}
          />
          <img
            src="emoji-2.png"
            alt="Dissatisfied"
            className={styles.emojiButton}
            onClick={() => setExperience("dissatisfied")}
            role="button"
            tabIndex={0}
          />
          <img
            src="emoji-3.png"
            alt="Neutral"
            className={styles.emojiButton}
            onClick={() => setExperience("neutral")}
            role="button"
            tabIndex={0}
          />
          <img
            src="emoji-4.png"
            alt="Satisfied"
            className={styles.emojiButton}
            onClick={() => setExperience("satisfied")}
            role="button"
            tabIndex={0}
          />
          <img
            src="emoji-5.png"
            alt="Very Satisfied"
            className={styles.emojiButton}
            onClick={() => setExperience("very-satisfied")}
            role="button"
            tabIndex={0}
          />
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

      <button type="submit" className={styles.submitButton} >
        Send Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
