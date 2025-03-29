"use client";

import React from "react";
import styles from "./styles.module.css";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import  LibraryWorkshop  from "./LibraryWorkshop";
import  VersionLogsSection  from './version/VersionLogsSection'

const ChangeLog: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image" >
      <div className={styles.libHeading}>
              Versions Log
      </div>
             <VersionLogsSection />

      </div>
    </div>
  );
};

export default ChangeLog;

