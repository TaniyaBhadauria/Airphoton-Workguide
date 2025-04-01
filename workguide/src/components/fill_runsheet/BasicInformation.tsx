import React from "react";
import styles from "./RunSheet.module.css"; // Importing CSS module for styling

// Functional component to display basic information form
const BasicInformation: React.FC = () => {
  return (
    // Section for the basic information form, with custom styles applied
    <section className={styles.basicInfo}>

      {/* Two-column grid layout for PRO # and Station input fields */}
      <div className={styles.twoColumnGrid}>

        {/* Form group for the PRO # field */}
        <div className={styles.formGroup}>
          <label htmlFor="proNumber" className={styles.label}>PRO #:</label>
          <input type="text" id="proNumber" className={styles.input} />
        </div>

        {/* Form group for the Station field */}
        <div className={styles.formGroup}>
          <label htmlFor="station" className={styles.label}>Station:</label>
          <input type="text" id="station" className={styles.input} />
        </div>
      </div>

      {/* Full-width input field for SA S/N */}
      <div className={styles.formGroup}>
        <label htmlFor="saSn" className={styles.label}>SA S/N:</label>
        <input type="text" id="saSn" className={styles.fullWidthInput} />
      </div>

      {/* Two-column grid layout for Technician and Date input fields */}
      <div className={styles.twoColumnGrid}>

        {/* Form group for Technician field */}
        <div className={styles.formGroup}>
          <label htmlFor="technician" className={styles.label}>Technician:</label>
          <input type="text" id="technician" className={styles.input} />
        </div>

        {/* Form group for the Technician Date field */}
        <div className={styles.formGroup}>
          <label htmlFor="techDate" className={styles.label}>Date:</label>
          <input type="date" id="techDate" className={styles.input} />
        </div>
      </div>

      {/* Two-column grid layout for Review and Review Date input fields */}
      <div className={styles.twoColumnGrid}>

        {/* Form group for Review field */}
        <div className={styles.formGroup}>
          <label htmlFor="review" className={styles.label}>Review:</label>
          <input type="text" id="review" className={styles.input} />
        </div>

        {/* Form group for the Review Date field */}
        <div className={styles.formGroup}>
          <label htmlFor="reviewDate" className={styles.label}>Date:</label>
          <input type="date" id="reviewDate" className={styles.input} />
        </div>
      </div>
    </section>
  );
};

export default BasicInformation; // Exporting the component to be used in other parts of the app
