"use client";
import React from "react";
import styles from "./VersionLogsSection.module.css";
import {SearchBar} from "./SearchBar";
import VersionTable from "./VersionTable";

const VersionLogsSection: React.FC = () => {
  return (
    <section className={styles.versionLogs}>
      <SearchBar />
      <VersionTable />
    </section>
  );
};

export default VersionLogsSection;
