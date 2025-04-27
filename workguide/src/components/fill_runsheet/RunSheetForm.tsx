"use client"; // Indicates that the component is intended for client-side rendering

import React, { useState } from "react";
import styles from "./RunSheet.module.css"; // Importing styles for the component
import { useSelector } from "react-redux"; // Hook to access the Redux store
import FormHeader from "./FormHeader"; // Custom form header component
import { RootState } from "../../redux/store"; // Type for the Redux store state
import BasicInformation from "./BasicInformation"; // Importing another component for displaying basic info

// Interface for the RunSheetForm props
interface RunSheetFormProps {
  onCancel: () => void; // Function to handle cancel action
}

const RunSheetForm: React.FC<RunSheetFormProps> = ({ onCancel }) => {
  // Using Redux to fetch the itemCode from the store
  const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);

  // State to handle form input values
  const [formData, setFormData] = useState({
    proNumber: "", // PRO number input
    station: "", // Station input
    saSn: "", // SA Serial number input
    technician: "", // Technician name input
    techDate: "", // Date of the technician input
    review: "", // Review input
    reviewDate: "" // Date of review input
  });

  // Function to handle changes to form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target; // Destructuring to get input id and value
    setFormData((prev) => ({
      ...prev,
      [id]: value // Update the respective input field in the form data
    }));
  };

  // Function to reset the form data
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

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    const payload = { ...formData, itemCode }; // Add itemCode to form data

    try {
      // Sending the form data to the backend API
      const res = await fetch("https://y-eta-lemon.vercel.app/api/submit", {
        method: "POST", // POST request method
        headers: {
          "Content-Type": "application/json" // Set content type as JSON
        },
        body: JSON.stringify(payload) // Convert the payload to JSON format
      });

      if (res.ok) {
        alert("Form submitted successfully!"); // Success alert
        handleCancel(); // Reset the form data
      } else {
        const error = await res.json();
        alert("Error: " + error.error); // Show error message if submission fails
      }
    } catch (error) {
      console.error("Error submitting form:", error); // Log any errors
      alert("Failed to submit the form."); // Error alert on failure
    }
  };

  return (
    <main className={styles.runsheetModal}>
      {/* Render the form header */}
      <FormHeader />

      {/* The main form container */}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {/* Section for basic information */}
        <section className={styles.basicInfo}>
          <div className={styles.twoColumnGrid}>
            {/* PRO Number input field */}
            <div className={styles.formGroup}>
              <label htmlFor="proNumber" className={styles.label}>PRO #:</label>
              <input
                type="text"
                id="proNumber"
                className={styles.input}
                value={formData.proNumber}
                onChange={handleChange}
              />
            </div>

            {/* Station input field */}
            <div className={styles.formGroup}>
              <label htmlFor="station" className={styles.label}>Station:</label>
              <input
                type="text"
                id="station"
                className={styles.input}
                value={formData.station}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SA Serial Number input field */}
          <div className={styles.formGroup}>
            <label htmlFor="saSn" className={styles.label}>SA S/N:</label>
            <input
              type="text"
              id="saSn"
              className={styles.fullWidthInput}
              value={formData.saSn}
              onChange={handleChange}
            />
          </div>

          <div className={styles.twoColumnGrid}>
            {/* Technician input field */}
            <div className={styles.formGroup}>
              <label htmlFor="technician" className={styles.label}>Technician:</label>
              <input
                type="text"
                id="technician"
                className={styles.input}
                value={formData.technician}
                onChange={handleChange}
              />
            </div>

            {/* Date input field for technician */}
            <div className={styles.formGroup}>
              <label htmlFor="techDate" className={styles.label}>Date:</label>
              <input
                type="date"
                id="techDate"
                className={styles.input}
                value={formData.techDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.twoColumnGrid}>
            {/* Review input field */}
            <div className={styles.formGroup}>
              <label htmlFor="review" className={styles.label}>Review:</label>
              <input
                type="text"
                id="review"
                className={styles.input}
                value={formData.review}
                onChange={handleChange}
              />
            </div>

            {/* Date input field for review */}
            <div className={styles.formGroup}>
              <label htmlFor="reviewDate" className={styles.label}>Date:</label>
              <input
                type="date"
                id="reviewDate"
                className={styles.input}
                value={formData.reviewDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Form actions for cancel and submit buttons */}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
    </main>
  );
};

export default RunSheetForm;
