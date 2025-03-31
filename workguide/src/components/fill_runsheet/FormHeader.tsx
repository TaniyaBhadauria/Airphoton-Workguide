import React from "react";
import styles from "./RunSheet.module.css";

const FormHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        CRFX-7003-A RUN SHEET FOR CR100 Assembled Product (CR-9014)
      </h1>
    </header>
  );
};

export default FormHeader;
