import React from "react"; // Importing React to enable JSX and component creation
import styles from "../styles.module.css"; // Importing the CSS module for styling the components
import { Header } from ".././Header"; // Importing the Header component for the page header
import { Navigation } from ".././Navigation"; // Importing the Navigation component for the page navigation

// Offline Mode component that serves as the main container for the offline page
const OfflineMode: React.FC = () => {
  return (
    <div className={styles.container}> {/* Main container for the ChangeLog page */}

      <Header /> {/* Renders the Header component at the top of the page */}

      <Navigation /> {/* Renders the Navigation component for navigating between pages */}

      {/* Hero image section with an accessible description */}
      <div className={styles.heroImage} role="img" aria-label="Hero image">

        {/* Heading for the version log section */}
        <div className={styles.libHeading}>
          Offline Mode {/* Text to display the section title */}
        </div>

      </div>
    </div>
  );
};

export default OfflineMode; // Export the ChangeLog component for use in other parts of the application
