import React from "react"; // Importing React to enable JSX and component creation
import styles from "./styles.module.css"; // Importing the CSS module for styling the components
import { Header } from "./Header"; // Importing the Header component for the page header
import { Navigation } from "./Navigation"; // Importing the Navigation component for the page navigation
import VersionLogsSection from './version/VersionLogsSection'; // Importing the VersionLogsSection component to display version logs

// ChangeLog component that serves as the main container for the version log page
const ChangeLog: React.FC = () => {
  return (
    <div className={styles.container}> {/* Main container for the ChangeLog page */}

      <Header /> {/* Renders the Header component at the top of the page */}

      <Navigation /> {/* Renders the Navigation component for navigating between pages */}

      {/* Hero image section with an accessible description */}
      <div className={styles.heroImage} role="img" aria-label="Hero image">

        {/* Heading for the version log section */}
        <div className={styles.libHeading}>
          Versions Log {/* Text to display the section title */}
        </div>

        {/* Renders the VersionLogsSection component to display the logs */}
        <VersionLogsSection />
      </div>
    </div>
  );
};

export default ChangeLog; // Export the ChangeLog component for use in other parts of the application
