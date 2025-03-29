"use client";
import * as React from "react";
import styles from "./InstallationGuide.module.css";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: boolean[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
}) => {
  const progress = (completedSteps.filter(Boolean).length / totalSteps) * 100;

  return (
    <section className={styles.progressSection}>
      <div className={styles.progressTracker}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isCompleted = completedSteps[index]; // Check if step is completed
          const isActive = step === currentStep;
          const isInactive = step >= currentStep && !isCompleted;

          return (
            <React.Fragment key={step}>
              <div
                className={`${styles.progressCircle} ${
                  isActive
                    ? styles.progressCircleActive // Black color for active step
                    : isCompleted
                    ? styles.progressCircleComplete // Checkmark for completed
                    : styles.progressCircleInactive // Default inactive state
                }`}
              >
                {isActive ? step : isCompleted ? "✓" : step}
              </div>

              {step < totalSteps && (
                <div
                  className={`${styles.progressBar} ${
                    isCompleted ? styles.progressBarActive : styles.progressBarInactive
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className={styles.progressText}>{Math.round(progress)}% completed</p>
    </section>
  );
};
