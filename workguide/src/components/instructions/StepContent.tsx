import * as React from "react"; // Importing React for component and state management
import styles from "./InstallationGuide.module.css"; // Importing the CSS module for styling the component
import { ImageGallery } from "./ImageGallery"; // Importing ImageGallery component for displaying images
import FeedbackForm from "../t/FeedbackForm"; // Importing FeedbackForm for the feedback modal
import RunSheetForm from "../fill_runsheet/RunSheetForm"; // Importing RunSheetForm for the run sheet modal
import FormHeader from "../fill_runsheet/FormHeader"; // Importing FormHeader for run sheet form header
import BasicInformation from "../fill_runsheet/BasicInformation"; // Importing BasicInformation for run sheet form
import ReactMarkdown from "react-markdown";

// Interface for the props passed to the StepContent component
interface StepContentProps {
  stepNumber: number;
  totalSteps: number;
  setStepNumber: React.Dispatch<React.SetStateAction<number>>; // Function to update the step number
  isCompleted: boolean; // Boolean to check if the current step is completed
  onComplete: (completed: boolean) => void; // Callback function to mark step as completed
  title: string; // Title for the current step
  content: string; // Content for the current step
  media: { media_path: string }[]; // Media files associated with the step (images, etc.)
}

// StepContent component to display information about each step in the process
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
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false); // State for toggling the feedback form
  const [isRunSheetOpen, setIsRunSheetOpen] = React.useState(false); // State for toggling the run sheet form

  // Handle previous button click (goes to the previous step)
  const handlePrevious = () => {
    if (stepNumber > 1) setStepNumber((prev) => prev - 1);
  };

  // Handle next button click (goes to the next step)
  const handleNext = () => {
    if (stepNumber < totalSteps) setStepNumber((prev) => prev + 1);
  };

  // Open the run sheet form modal when the button is clicked
  const handleFillRunSheet = () => {
    setIsRunSheetOpen(true);
  };

  return (
    <article className={styles.stepContent}> {/* Main content container for the current step */}
      <nav className={styles.navigationButtons}> {/* Navigation buttons for previous and next steps */}
        <button className={styles.button} onClick={handlePrevious} disabled={stepNumber === 1}>
          Previous {/* Button to navigate to the previous step */}
        </button>
       {stepNumber === totalSteps ? (
           <button
             className={styles.button}
             onClick={handleFillRunSheet}
             disabled={!isCompleted} // Disable if the current step is not completed
           >
             Fill Runsheet
           </button>
         ) : (
           <button
             className={styles.button}
             onClick={handleNext}
           >
             Next {/* Button to navigate to the next step */}
           </button>
         )}
      </nav>

      <header className={styles.stepHeader}> {/* Header displaying the current step title */}
        <h4 className={styles.stepTitle}>Step {stepNumber}: {title}</h4>
        <div className={styles.completionCheck}> {/* Checkbox for marking the step as completed */}
          <input
            type="checkbox"
            id={`complete-step-${stepNumber}`}
            className={styles.checkbox}
            checked={isCompleted}
            onChange={(e) => onComplete(e.target.checked)} // Trigger onComplete callback when checkbox state changes
          />
          <label htmlFor={`complete-step-${stepNumber}`} className={styles.checkboxLabel}>
            Mark as completed
          </label>
        </div>
      </header>

      <div className={styles.contentGrid}> {/* Grid layout for displaying step content */}
        <div className={styles.contentCard}> {/* Card container for the content and images */}
          <div className={styles.cardGrid}> {/* Grid for content and image gallery */}
            <ImageGallery
              mainImage={media.length > 0 ? media[0].media_path : "https://placehold.co/800x600/e2e8f0/e2e8f0"} // Display the main image or a placeholder
              thumbnails={media.slice(1).map((m) => m.media_path)} // Display thumbnails of additional images
            />
            <div className={styles.instructionsContainer}> {/* Container for the step instructions */}
              <div className={styles.instructionsText}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
              <footer className={styles.footer}> {/* Footer for the step content */}
                <button className={styles.button} onClick={() => setIsFeedbackOpen(true)}>
                  Submit Feedback {/* Button to open the feedback form modal */}
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>

      {isFeedbackOpen && (
        <div className={styles.modalOverlay}> {/* Overlay for the feedback form modal */}
          <div className={styles.modalContent}> {/* Content of the modal */}
            <button className={styles.closeButton} onClick={() => setIsFeedbackOpen(false)}>
              ✖ {/* Close button for the feedback modal */}
            </button>
            <FeedbackForm onClose={() => setIsFeedbackOpen(false)} /> {/* Feedback form component */}
          </div>
        </div>
      )}

      {/* Conditionally render the RunSheetForm modal when the button is clicked */}
      {isRunSheetOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <RunSheetForm onCancel={() => setIsRunSheetOpen(false)} />
          </div>
        </div>
      )}
    </article>
  );
};
