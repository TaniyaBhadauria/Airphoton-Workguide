import React from "react"; // Importing React to enable JSX syntax and component creation
import styles from "./styles.module.css"; // Importing CSS module for styling the components
import logo from "./images/logo.png"; // Importing the logo image file for use in the header
import UserControls from "./UserControls"; // Importing the UserControls component to display user-related controls

// Header component that renders the page header
export const Header: React.FC = () => {
  return (
    <header className={styles.header}> {/* The header section of the page with applied styles */}

      {/* Image element to display the logo */}
      <img
        src={logo} // The logo image is sourced from the imported file
        alt="Logo" // The alt text for accessibility
        className={styles.logo} // Applying the CSS class from the styles module to the logo
      />

      {/* Renders the UserControls component, which might include things like user profile and notifications */}
      <UserControls />
    </header>
  );
};
