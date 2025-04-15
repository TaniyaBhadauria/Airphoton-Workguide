import React from "react";
import styles from "../styles.module.css";
import { Header } from "../Header";
import { Navigation } from "../Navigation";
import InstallationGuide from "./InstallationGuide";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const Instructions: React.FC = () => {
    const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);
  const handleDownload = async () => {
    try {
      const response = await fetch(`https://y-eta-lemon.vercel.app/download_instructions?item_code=${itemCode}`);

      if (!response.ok) {
        throw new Error("Failed to download instructions");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "instructions.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image">
        <div className={styles.libHeading}>
          Breather Vent Installation Instructions
          <button className={styles.button} onClick={handleDownload}>
                            Download Instructions
                          </button>
        </div>

        <InstallationGuide />
      </div>
    </div>
  );
};

export default Instructions;
