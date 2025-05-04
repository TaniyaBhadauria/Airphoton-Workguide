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


        {/* Image icon indicating more results */}

      </a>
    </footer>
  );
}
