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
}

interface FormActionsProps {
  onCancel: () => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, type = "text", value, onChange }) => {
  const isFile = type === "file";

  return (
    <>
      <label className={styles.formLabel}>{label}</label>
      <input
        type={type}
        className={styles.formInput}
        value={isFile ? undefined : value} // don't bind value for file inputs
        onChange={onChange}
        {...(isFile ? { accept: "image/*", multiple: true } : {})}
      />
    </>
  );
};

// StepItem component - Handling multiple files for each step
interface StepItemProps {
  stepNumber: number;
  onMediaChange: (stepNumber: number, files: FileList | null) => void;
}

const StepItem: React.FC<StepItemProps> = ({ stepNumber, onMediaChange }) => {
  const [media, setMedia] = React.useState<File[]>([]); // Store an array of files

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMedia(newFiles);
      onMediaChange(stepNumber, e.target.files); // Send the files to the parent
    }
  };

  return (
    <>
      <section className={styles.formRow}>
        <FormField label={`Step ${stepNumber}: title`} />
        <FormField label={`Step ${stepNumber} content:`} />
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
      <button type="button" className={styles.secondaryButton} onClick={onCancel}>
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
  const [itemCode, setItemCode] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [bomCode, setBomCode] = React.useState('');
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [steps, setSteps] = React.useState<number[]>([1, 2]); // initial steps
  const [stepMedia, setStepMedia] = React.useState<Map<number, File[]>>(new Map()); // Change to an array of files

  const addStep = () => {
    setSteps(prev => [...prev, prev.length + 1]);
  };

  const handleStepMediaChange = (stepNumber: number, files: FileList | null) => {
    if (files) {
      setStepMedia(prev => new Map(prev).set(stepNumber, Array.from(files)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append('itemCode', itemCode);
    formData.append('itemName', itemName);
    formData.append('bomCode', bomCode);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    // Add steps data
    steps.forEach((stepNumber, index) => {
      formData.append(`step_${index + 1}_title`, `Step ${stepNumber} title`);
      formData.append(`step_${index + 1}_content`, `Step ${stepNumber} content`);

      // Add multiple files for each step
      const mediaFiles = stepMedia.get(stepNumber);
      if (mediaFiles && Array.isArray(mediaFiles)) {
        mediaFiles.forEach((file, idx) => {
          formData.append(`step_${index + 1}_media_${idx + 1}`, file); // Append each file with a unique key
        });
      }
    });

    try {
      // Send data to backend (replace the URL with your API endpoint)
      const response = await fetch('https://y-eta-lemon.vercel.app/submitForm', {
        method: 'POST',
        body: formData,
      });

      // Handle the response from the backend
      if (response.ok) {
        console.log('Form submitted successfully');
        onClose(); // Close the modal on successful submit
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <article className={styles.formContainer}>
      <FormHeader />
      <form className={styles.formContent} onSubmit={handleSubmit}> {/* Attach handleSubmit here */}
        <section className={styles.formRow}>
          <FormField
            label="Item Code"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
          />
          <FormField
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </section>

        <section className={styles.formRow}>
          <FormField
            label="Bom Code"
            value={bomCode}
            onChange={(e) => setBomCode(e.target.value)}
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

        {/* Render StepItems dynamically */}
        {steps.map((stepNumber) => (
          <StepItem key={stepNumber} stepNumber={stepNumber} onMediaChange={handleStepMediaChange} />
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
