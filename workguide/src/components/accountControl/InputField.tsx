"use client";

import React from "react";
import styles from "./InputField.module.css";

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
  showPasswordToggle?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  showPasswordToggle = false,
  value,
  onChange
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={styles.inputContainer}>
      <div className={styles.labelRow}>
        <label className={styles.label}>{label}</label>
        {showPasswordToggle && (
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      <input
        type={showPassword ? "text" : type}
        className={styles.input}
        aria-label={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
