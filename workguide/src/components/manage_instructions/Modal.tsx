import React from "react"; // Importing React library
import styles from "./SearchBar.module.css"; // Importing the CSS module for styling

// Defining the props for the Modal component
interface ModalProps {
  onClose: () => void; // Function to close the modal
  children: React.ReactNode; // Content to be displayed inside the modal
}

// Modal component definition
const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className={styles.overlay}> {/* The overlay that covers the background */}
      <div className={styles.modal}> {/* The modal container */}
        {/* Close button inside the modal, triggers the onClose function when clicked */}
        <button className={styles.closeButton} onClick={onClose}>
          × {/* Displaying the '×' symbol as the close button */}
        </button>
        {children} {/* Rendering the children (content) passed to the Modal */}
      </div>
    </div>
  );
};

export default Modal; // Exporting the Modal component to use elsewhere
