import React from "react";
import styles from "./ResultsSummary.module.css";

const ResultsSummary: React.FC = () => {
  return (
    <div className={styles.summary}>
      <span className={styles.resultCount}>3 Search Results</span>
      <a href="#" className={styles.moreLink}>
        <span>Show me more results</span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/809a93c48a988bdddd7aaf5798dcdf7f8cc556a8?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"
          alt="Show more"
          className={styles.moreIcon}
        />
      </a>
    </div>
  );
};

export default ResultsSummary;
