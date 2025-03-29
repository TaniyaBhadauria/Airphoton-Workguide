"use client";

import React from "react";
import styles from "../styles.module.css";
import { Header } from "../Header";
import { Navigation } from "../Navigation";
import  LibraryWorkshop  from "../LibraryWorkshop";
import  InstallationGuide  from "./InstallationGuide";


const Instructions: React.FC = () => {
    const [isCompleted, setIsCompleted] = React.useState(false);
  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image" >
      <div className={styles.libHeading}>
              Breather Vent Installation Instructions
      </div>
      <InstallationGuide />
      </div>
    </div>
  );
};

export default Instructions;
