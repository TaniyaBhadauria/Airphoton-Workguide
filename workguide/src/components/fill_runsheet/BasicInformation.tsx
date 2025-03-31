import React from "react";
import styles from "./RunSheet.module.css";

const BasicInformation: React.FC = () => {
  return (
    <section className={styles.basicInfo}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="proNumber" className={styles.label}>
            PRO #:
          </label>
          <input type="text" id="proNumber" className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="station" className={styles.label}>
            Station:
          </label>
          <input type="text" id="station" className={styles.input} />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="saSn" className={styles.label}>
          SA S/N:
        </label>
        <input type="text" id="saSn" className={styles.fullWidthInput} />
      </div>

      <div className={styles.twoColumnGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="technician" className={styles.label}>
            Technician:
          </label>
          <input type="text" id="technician" className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="techDate" className={styles.label}>
            Date:
          </label>
          <input type="date" id="techDate" className={styles.input} />
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="review" className={styles.label}>
            Review:
          </label>
          <input type="text" id="review" className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="reviewDate" className={styles.label}>
            Date:
          </label>
          <input type="date" id="reviewDate" className={styles.input} />
        </div>
      </div>
    </section>
  );
};

export default BasicInformation;
