"use client";
import React from "react";
import styles from "./VersionLogsSection.module.css";
import {SearchBar} from "./SearchBar";
import VersionTable from "./VersionTable";
import ResultsSummary from "./ResultsSummary";

const VersionLogsSection: React.FC = () => {
  return (
    <section className={styles.versionLogs}>
      <SearchBar />
      <VersionTable />
      <hr className={styles.divider} />
      <ResultsSummary />
    </section>
  );
};

export default VersionLogsSection;
