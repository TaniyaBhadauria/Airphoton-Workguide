"use client";
import * as React from "react";
import styles from "./SearchBar.module.css";

// FormHeader component
const FormHeader = () => {
  return <h1 className={styles.formTitle}>Create new work instruction</h1>;
};

// FormField component
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
        {...(isFile ? { accept: "image/*", multiple: true } : {})}
      />
    </>
  );
};

// StepItem component
interface StepItemProps {
  stepNumber: number;
}

const StepItem: React.FC<StepItemProps> = ({ stepNumber }) => {
  return (
    <>
      <section className={styles.formRow}>
        <FormField label={`Step ${stepNumber}: title`} />
        <FormField label={`Step ${stepNumber} content :`} />
      </section>
      <section className={styles.formRow}>
        <FormField label="Media" type="file" />
      </section>
    </>
  );
};

// FormActions component
const FormActions = () => {
  return (
    <section className={styles.buttonContainer}>
      <button type="button" className={styles.secondaryButton}>Cancel</button>
      <button type="submit" className={styles.primaryButton}>Submit</button>
    </section>
  );
};

// Main InputDesign component
function InputDesign() {
  const [steps, setSteps] = React.useState<number[]>([1, 2]); // initial steps

  const addStep = () => {
    setSteps(prev => [...prev, prev.length + 1]);
  };

  return (
    <article className={styles.formContainer}>
      <FormHeader />
      <form className={styles.formContent}>
        <section className={styles.formRow}>
          <FormField label="Item Code" />
          <FormField label="Item Name" />
        </section>

        <section className={styles.formRow}>
          <FormField label="Bom Code" />
          <FormField label="Cover Image" type="file" />
        </section>

        <h2 className={styles.sectionTitle}>Steps to Complete:</h2>

        {/* Render StepItems dynamically */}
        {steps.map((stepNumber) => (
          <StepItem key={stepNumber} stepNumber={stepNumber} />
        ))}

        <button
          type="button"
          className={styles.primaryButton}
          onClick={addStep}
        >
          + Add Another Step
        </button>

        <FormActions />
      </form>
    </article>
  );
}

export default InputDesign;
