"use client";

import React from "react";
import styles from "../styles.module.css";
import { Header } from "../Header";
import { Navigation } from "../Navigation";
import  VersionLogsSection  from './VersionLogsSection'

const Feedbacks: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image" >
      <VersionLogsSection />
      </div>
    </div>
  );
};

export default Feedbacks;

