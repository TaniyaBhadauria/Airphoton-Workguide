import React from "react"; // Importing React for JSX syntax and component structure
import styles from "./styles.module.css"; // Importing CSS module for styling
import { MenuIcon } from "./icons/MenuIcon"; // Importing the MenuIcon component to be used in the navigation bar

// Navigation component to display the navigation bar with links
export const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigationBar}> {/* Main container for the navigation bar */}
      <div className={styles.navigationContent}> {/* Container for the navigation content */}
        <MenuIcon /> {/* The icon representing the menu */}
        <div className={styles.menuItems}> {/* Container for the menu items */}
          {/* Navigation links for different sections */}
          <a href="/lib" className={styles.menuLink}> {/* Link to the home page */}
            Home
          </a>
          <a href="/lib" className={styles.menuLink}> {/* Link to the library section */}
            Library
          </a>
          <a href="/feedbacks" className={styles.menuLink}> {/* Link to manage feedbacks */}
            Manage Feedback
          </a>
          <a href="/versions" className={styles.menuLink}> {/* Link to the change log */}
            Change Log
          </a>
        </div>
      </div>
    </nav>
  );
};
