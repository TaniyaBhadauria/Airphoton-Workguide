"use client";
import React from "react";
import styles from "./RunSheet.module.css";
import FormHeader from "./FormHeader";
import BasicInformation from "./BasicInformation";

const RunSheetForm: React.FC = () => {
  return (
    <main className={styles.runsheetModal}>
      <FormHeader />
      <form className={styles.formContainer}>
        <BasicInformation />
        <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </div>
      </form>
    </main>
  );
};

export default RunSheetForm;
