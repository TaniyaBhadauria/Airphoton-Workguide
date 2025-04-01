import React from "react"; // Importing React to enable JSX syntax and component creation
import styles from "./styles.module.css"; // Importing CSS module for styling the components
import { Header } from "./Header"; // Importing the Header component for displaying the header of the page
import { Navigation } from "./Navigation"; // Importing the Navigation component for displaying the navigation menu
import LibraryWorkshop from "./LibraryWorkshop"; // Importing the LibraryWorkshop component to display search and work instructions

// InputDesign component that serves as the main layout of the page
const InputDesign: React.FC = () => {
  return (
    <div className={styles.container}> {/* Main container of the page with applied styles */}

      {/* Render the Header component */}
      <Header />

      {/* Render the Navigation component */}
      <Navigation />

      {/* Hero image section with a background and heading */}
      <div className={styles.heroImage} role="img" aria-label="Hero image"> {/* The div acts as an image container with accessible attributes */}

        {/* Heading that provides a brief description of the Library Workshop section */}
        <div className={styles.libHeading}>
          Library Workshop - Search, and access work instructions for all available products
        </div>

        {/* Render the LibraryWorkshop component, which handles the main functionality for searching and accessing work instructions */}
        <LibraryWorkshop />
      </div>
    </div>
  );
};

export default InputDesign; // Exporting the InputDesign component to be used elsewhere in the application
