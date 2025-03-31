import React from "react";
import styles from "./LibraryWorkshop.module.css";

export function SearchFooter() {
  return (
    <footer className={styles.footerContainer}>
      <p className={styles.resultsCount}>14 Search Results</p>
      <a href="#" className={styles.showMoreLink}>
        <span className={styles.showMoreText}>Show me more results</span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/809a93c48a988bdddd7aaf5798dcdf7f8cc556a8?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"
          alt="Show more"
          className={styles.showMoreIcon}
        />
      </a>
    </footer>
  );
}
