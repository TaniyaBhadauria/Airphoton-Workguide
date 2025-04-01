import React from "react"; // Importing React to use JSX and create the component
import styles from "./LibraryWorkshop.module.css"; // Importing the CSS module for styling

// SearchFooter component that renders the footer of the search results section
export function SearchFooter() {
  return (
    <footer className={styles.footerContainer}> {/* Footer container for the section */}

      {/* Paragraph showing the number of search results */}
      <p className={styles.resultsCount}>14 Search Results</p>

      {/* Link that leads to the library page with an option to show more results */}
      <a href="/lib" className={styles.showMoreLink}>

        {/* Text inside the link button */}
        <span className={styles.showMoreText}>Show me more results</span>

        {/* Image icon indicating more results */}
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/809a93c48a988bdddd7aaf5798dcdf7f8cc556a8?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"
          alt="Show more" // Alt text for the image icon
          className={styles.showMoreIcon} // Styling the image with CSS module
        />
      </a>
    </footer>
  );
}
