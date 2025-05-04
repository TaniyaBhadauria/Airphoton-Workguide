"use client"; // This directive is used for enabling client-side rendering in Next.js

import * as React from "react"; // Importing React for JSX and component creation
import styles from "./LibraryWorkshop.module.css"; // Importing the CSS module for styling the LibraryWorkshop component
import { SearchBar } from "./SearchBar"; // Importing the SearchBar component, which allows users to search for work instructions
import { SearchResults } from "./SearchResults"; // Importing the SearchResults component to display the results of the search
import { SearchFooter } from "./SearchFooter"; // Importing the SearchFooter component to display additional footer content like result count

// LibraryWorkshop component that acts as the main container for the search functionality
export default function LibraryWorkshop() {
  return (
    <main className={styles.container}> {/* Main container with applied styles */}

      {/* Render the SearchBar component to allow users to search */}
      <SearchBar />

      {/* Render the SearchResults component to display the search results */}
      <SearchResults />
    </main>
  );
}
