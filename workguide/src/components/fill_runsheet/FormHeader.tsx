import React from "react"; // Importing React library for JSX support
import styles from "./RunSheet.module.css"; // Importing the CSS module for styling

// Functional component to display the header of the form
const FormHeader: React.FC = () => {
  return (
    // Header section with custom styling applied from the CSS module
    <header className={styles.header}>

      {/* Title of the run sheet displayed inside an <h1> tag */}
      <h1 className={styles.title}>
        CRFX-7003-A RUN SHEET FOR CR100 Assembled Product (CR-9014)
      </h1>
    </header>
  );
};

export default FormHeader; // Exporting the component to be used in other parts of the app
