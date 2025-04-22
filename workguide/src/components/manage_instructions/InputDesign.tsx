"use client";
import * as React from "react";
import styles from "./SearchBar.module.css";

// FormHeader component for the title section
const FormHeader = () => {
  return <h1 className={styles.formTitle}>Create new work instruction</h1>;
};

// FormField component for input fields with labels
interface FormFieldProps {
  label: string;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, type = "text" }) => {
  const isFile = type === "file";

  return (
    <>
      <label className={styles.formLabel}>{label}</label>
      <input
        type={type}
        className={styles.formInput}
        {...(isFile
          ? { accept: "image/*", multiple: true }
          : {})}
      />
    </>
  );
};

// StepItem component for each instruction step
interface StepItemProps {
  stepNumber: number;
}

const StepItem: React.FC<StepItemProps> = ({ stepNumber }) => {
  return (
    <>
      <section className={styles.formRow}>
        <FormField label={`Step${stepNumber}:`} />
        <FormField
          label={`Step${stepNumber} Description${stepNumber > 1 ? ":" : ""}`}
        />
      </section>
      <section className={styles.formRow}>
        <FormField label="Multimedia Upload" type="file" />
      </section>
    </>
  );
};

// FormActions component for the buttons at the bottom
const FormActions = () => {
  return (
    <section className={styles.buttonContainer}>
      <button className={styles.secondaryButton}>Cancel</button>
      <button className={styles.primaryButton}>Submit</button>
    </section>
  );
};

// Main InputDesign component
function InputDesign() {
  return (
    <article className={styles.formContainer}>
      <FormHeader />
      <form className={styles.formContent}>
        <section className={styles.formRow}>
          <FormField label="Instruction Title" />
          <FormField label="Description" />
        </section>

        <h2 className={styles.sectionTitle}>Steps to Complete:</h2>

        <StepItem stepNumber={1} />
        <StepItem stepNumber={2} />

        <button type="button" className={styles.primaryButton}>
          + Add Another Step
        </button>

        <FormActions />
      </form>
    </article>
  );
}

export default InputDesign;
