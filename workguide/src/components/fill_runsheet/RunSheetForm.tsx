"use client";
import React, { useState } from "react";
import styles from "./RunSheet.module.css";
import { useSelector } from "react-redux";
import FormHeader from "./FormHeader";
import { RootState } from "../../redux/store";
import BasicInformation from "./BasicInformation";
interface RunSheetFormProps {
  onCancel: () => void;
}
const RunSheetForm: React.FC<RunSheetFormProps> = ({ onCancel }) => {
    const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);
  const [formData, setFormData] = useState({
    proNumber: "",
    station: "",
    saSn: "",
    technician: "",
    techDate: "",
    review: "",
    reviewDate: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCancel = () => {
    setFormData({
      proNumber: "",
      station: "",
      saSn: "",
      technician: "",
      techDate: "",
      review: "",
      reviewDate: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, itemCode };

    try {
      const res = await fetch("https://y-eta-lemon.vercel.app/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Form submitted successfully!");
         handleCancel();
      } else {
        const error = await res.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form.");
    }
  };

  return (
    <main className={styles.runsheetModal}>
      <FormHeader />
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <section className={styles.basicInfo}>
          <div className={styles.twoColumnGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="proNumber" className={styles.label}>PRO #:</label>
              <input type="text" id="proNumber" className={styles.input} value={formData.proNumber} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="station" className={styles.label}>Station:</label>
              <input type="text" id="station" className={styles.input} value={formData.station} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="saSn" className={styles.label}>SA S/N:</label>
            <input type="text" id="saSn" className={styles.fullWidthInput} value={formData.saSn} onChange={handleChange} />
          </div>

          <div className={styles.twoColumnGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="technician" className={styles.label}>Technician:</label>
              <input type="text" id="technician" className={styles.input} value={formData.technician} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="techDate" className={styles.label}>Date:</label>
              <input type="date" id="techDate" className={styles.input} value={formData.techDate} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.twoColumnGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="review" className={styles.label}>Review:</label>
              <input type="text" id="review" className={styles.input} value={formData.review} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reviewDate" className={styles.label}>Date:</label>
              <input type="date" id="reviewDate" className={styles.input} value={formData.reviewDate} onChange={handleChange} />
            </div>
          </div>
        </section>

        <div className={styles.formActions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
    </main>
  );
};

export default RunSheetForm;
