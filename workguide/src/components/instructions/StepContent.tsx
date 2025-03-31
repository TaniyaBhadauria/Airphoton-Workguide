"use client";
import * as React from "react";
import styles from "./InstallationGuide.module.css";
import { ImageGallery } from "./ImageGallery";
import FeedbackForm from "../t/FeedbackForm";
import RunSheetForm from "../fill_runsheet/RunSheetForm";
import FormHeader from "../fill_runsheet/FormHeader";
import BasicInformation from "../fill_runsheet/BasicInformation";

interface StepContentProps {
  stepNumber: number;
  totalSteps: number;
  setStepNumber: React.Dispatch<React.SetStateAction<number>>;
  isCompleted: boolean;
  onComplete: (completed: boolean) => void;
  title: string;
  content: string;
  media: { media_path: string }[];
}

export const StepContent: React.FC<StepContentProps> = ({
  stepNumber,
  totalSteps,
  setStepNumber,
  isCompleted,
  onComplete,
  title,
  content,
  media,
}) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const [isRunSheetOpen, setIsRunSheetOpen] = React.useState(false);

  const handlePrevious = () => {
    if (stepNumber > 1) setStepNumber((prev) => prev - 1);
  };

  const handleNext = () => {
    if (stepNumber < totalSteps) setStepNumber((prev) => prev + 1);
  };

  const handleFillRunSheet = () => {
      setIsRunSheetOpen(true);
    };

  return (
    <article className={styles.stepContent}>
      <nav className={styles.navigationButtons}>
        <button className={styles.button} onClick={handlePrevious} disabled={stepNumber === 1}>
          Previous
        </button>
       {stepNumber === totalSteps ? (
           <button
             className={styles.button}
             onClick={handleFillRunSheet}
             disabled={!isCompleted} // Ensure step is marked completed before proceeding
           >
             Fill Runsheet
           </button>
         ) : (
           <button
             className={styles.button}
             onClick={handleNext}
           >
             Next
           </button>
         )}

      </nav>

      <header className={styles.stepHeader}>
        <h4 className={styles.stepTitle}>Step {stepNumber}: {title}</h4>
        <div className={styles.completionCheck}>
          <input
            type="checkbox"
            id={`complete-step-${stepNumber}`}
            className={styles.checkbox}
            checked={isCompleted}
            onChange={(e) => onComplete(e.target.checked)}
          />
          <label htmlFor={`complete-step-${stepNumber}`} className={styles.checkboxLabel}>
            Mark as completed
          </label>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.contentCard}>
          <div className={styles.cardGrid}>
            <ImageGallery
              mainImage={media.length > 0 ? media[0].media_path : "https://placehold.co/800x600/e2e8f0/e2e8f0"}
              thumbnails={media.slice(1).map((m) => m.media_path)}
            />
            <div className={styles.instructionsContainer}>
              <p className={styles.instructionsText} dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }}></p>
              <footer className={styles.footer}>
                <button className={styles.button} onClick={() => setIsFeedbackOpen(true)}>
                  Submit Feedback
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>

      {isFeedbackOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setIsFeedbackOpen(false)}>
              ✖
            </button>
            <FeedbackForm />
          </div>
        </div>
      )}
      {/* Conditionally render the RunSheetForm when the button is clicked */}
                      {isRunSheetOpen && (
                             <main className={styles.runsheetModal}>
                                   <FormHeader />
                                   <form className={styles.formContainer}>
                                     <BasicInformation />
                                     <div className={styles.formActions}>
                                           <button type="button" className={styles.cancelButton} onClick={() => setIsRunSheetOpen(false)}>
                                             Cancel
                                           </button>
                                           <button type="submit" className={styles.submitButton}>
                                             Submit
                                           </button>
                                         </div>
                                   </form>
                                 </main>
                           )}
    </article>
  );
};
