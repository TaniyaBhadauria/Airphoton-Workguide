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
  isFile?: boolean;
  value?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

interface FormActionsProps {
  onCancel: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  error,
}) => {
  const isFile = type === "file";

  return (
    <div className={styles.formFieldWrapper}>
      <label className={styles.formLabel}>{label}</label>
      <input
        type={type}
        className={styles.formInput}
        value={isFile ? undefined : value}
        onChange={onChange}
        {...(isFile ? { accept: "image/*", multiple: true } : {})}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

// StepItem component
interface StepItemProps {
  stepNumber: number;
  title: string;
  content: string;
  onTitleChange: (stepNumber: number, value: string) => void;
  onContentChange: (stepNumber: number, value: string) => void;
  onMediaChange: (stepNumber: number, files: FileList | null) => void;
}

const StepItem: React.FC<StepItemProps> = ({
  stepNumber,
  title,
  content,
  onTitleChange,
  onContentChange,
  onMediaChange,
}) => {
  const [media, setMedia] = React.useState<File[]>([]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMedia(newFiles);
      onMediaChange(stepNumber, e.target.files);
    }
  };

  return (
    <>
      <section className={styles.formRow}>
        <FormField
          label={`Step ${stepNumber}: Title`}
          value={title}
          onChange={(e) => onTitleChange(stepNumber, e.target.value)}
        />
        <FormField
          label={`Step ${stepNumber}: Content`}
          value={content}
          onChange={(e) => onContentChange(stepNumber, e.target.value)}
        />
      </section>
      <section className={styles.formRow}>
        <FormField label="Media" type="file" onChange={handleMediaChange} />
        {media.length > 0 && (
          <ul>
            {media.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

// FormActions component
const FormActions: React.FC<FormActionsProps> = ({ onCancel }) => {
  return (
    <section className={styles.buttonContainer}>
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onCancel}
      >
        Cancel
      </button>
      <button type="submit" className={styles.primaryButton}>
        Submit
      </button>
    </section>
  );
};

// Main InputDesign component
function InputDesign({ onClose }: { onClose: () => void }) {
  const [itemCode, setItemCode] = React.useState("");
  const [itemName, setItemName] = React.useState("");
  const [bomCode, setBomCode] = React.useState("");
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [steps, setSteps] = React.useState<number[]>([1, 2]);
  const [stepTitles, setStepTitles] = React.useState<Map<number, string>>(
    new Map()
  );
  const [stepContents, setStepContents] = React.useState<Map<number, string>>(
    new Map()
  );
  const [stepMedia, setStepMedia] = React.useState<Map<number, File[]>>(
    new Map()
  );
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const addStep = () => {
    setSteps((prev) => [...prev, prev.length + 1]);
  };

  const handleStepTitleChange = (stepNumber: number, value: string) => {
    setStepTitles((prev) => new Map(prev).set(stepNumber, value));
  };

  const handleStepContentChange = (stepNumber: number, value: string) => {
    setStepContents((prev) => new Map(prev).set(stepNumber, value));
  };

  const handleStepMediaChange = (stepNumber: number, files: FileList | null) => {
    if (files) {
      setStepMedia((prev) => new Map(prev).set(stepNumber, Array.from(files)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!itemCode.trim()) newErrors.itemCode = "Item Code is required";
    if (!itemName.trim()) newErrors.itemName = "Item Name is required";
    if (!bomCode.trim()) newErrors.bomCode = "BOM Code is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append("itemCode", itemCode);
    formData.append("itemName", itemName);
    formData.append("bomCode", bomCode);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    steps.forEach((stepNumber, index) => {
      formData.append(`step_${index + 1}_title`, stepTitles.get(stepNumber) || "");
      formData.append(`step_${index + 1}_content`, stepContents.get(stepNumber) || "");

      const mediaFiles = stepMedia.get(stepNumber);
      if (mediaFiles && Array.isArray(mediaFiles)) {
        mediaFiles.forEach((file, idx) => {
          formData.append(`step_${index + 1}_media_${idx + 1}`, file);
        });
      }
    });

    try {
      const response = await fetch("https://y-eta-lemon.vercel.app/submitForm", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        onClose();
      } else {
        console.error("Error submitting form:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <article className={styles.formContainer}>
      <FormHeader />
      <form className={styles.formContent} onSubmit={handleSubmit}>
        <section className={styles.formRow}>
          <FormField
            label="Item Code"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            error={errors.itemCode}
          />
          <FormField
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            error={errors.itemName}
          />
        </section>

        <section className={styles.formRow}>
          <FormField
            label="Bom Code"
            value={bomCode}
            onChange={(e) => setBomCode(e.target.value)}
            error={errors.bomCode}
          />
          <FormField
            label="Cover Image"
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setCoverImage(e.target.files[0]);
              }
            }}
          />
        </section>

        <h2 className={styles.sectionTitle}>Steps to Complete:</h2>

        {steps.map((stepNumber) => (
          <StepItem
            key={stepNumber}
            stepNumber={stepNumber}
            title={stepTitles.get(stepNumber) || ""}
            content={stepContents.get(stepNumber) || ""}
            onTitleChange={handleStepTitleChange}
            onContentChange={handleStepContentChange}
            onMediaChange={handleStepMediaChange}
          />
        ))}

        <button
          type="button"
          className={styles.primaryButton}
          onClick={addStep}
        >
          + Add Another Step
        </button>

        <FormActions onCancel={onClose} />
      </form>
    </article>
  );
}

export default InputDesign;
