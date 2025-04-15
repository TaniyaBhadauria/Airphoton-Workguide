"use client";
import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import styles from "./InstallationGuide.module.css";
import { ProgressTracker } from "./ProgressTracker";
import { StepContent } from "./StepContent";

const TOTAL_STEPS = 5; // Adjust total steps as needed
const InstallationGuide: React.FC = () => {
    const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);
  const [stepNumber, setStepNumber] = React.useState(1);
  const [instructions, setInstructions] = React.useState<
      { title: string; content: string; media: { media_path: string }[] }[]
    >([]);
  const [completedSteps, setCompletedSteps] = React.useState<boolean[]>(
      Array(TOTAL_STEPS).fill(false)
    );
  React.useEffect(() => {
      if (itemCode) {
          fetch(`https://y-eta-lemon.vercel.app/instructions?item_code=${itemCode}`)
          .then((res) => res.json())
          .then((data) => {
              const BASE_URL = "https://raw.githubusercontent.com/TaniyaBhadauria/apps-wi/master/";
              const updatedInstructions = data.map((instruction: any) => ({
                        ...instruction,
                        media: instruction.media.map((media: any) => ({
                          ...media,
                          media_path: `${BASE_URL}${media.media_path.replace(/\x00/g, "")}`})),
                      }));
            setInstructions(updatedInstructions);
            setCompletedSteps(Array(data.length).fill(false)); // Initialize completion state
          })
          .catch((error) => console.error("Error fetching instructions:", error));
      }
    }, [itemCode]);

  const handleCompletion = (step: number, isCompleted: boolean) => {
      setCompletedSteps((prev) => {
        const newCompletion = [...prev];
        newCompletion[step - 1] = isCompleted; // Update only the current step
        return newCompletion;
      });
    };

  return (
    <main className={styles.container}>
      <ProgressTracker
              currentStep={stepNumber}
              totalSteps={instructions.length}
              completedSteps={completedSteps}
            />
      {instructions.length > 0 && stepNumber <= instructions.length ? (
        <StepContent
          stepNumber={stepNumber}
          totalSteps={instructions.length}
          setStepNumber={setStepNumber}
          isCompleted={completedSteps[stepNumber - 1]}
          onComplete={(completed) => handleCompletion(stepNumber, completed)}
          title={instructions[stepNumber - 1]?.title || "Loading..."}
          content={instructions[stepNumber - 1]?.content || ""}
          media={instructions[stepNumber - 1]?.media || []}
        />
      ) : (
        <p>Loading instructions...</p>
      )}
    </main>
  );
};

export default InstallationGuide;
