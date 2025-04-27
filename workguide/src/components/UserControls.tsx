import React from "react"; // Importing React to use JSX and create the component
import styles from "./styles.module.css"; // Importing CSS module for styling the component
import { NotificationIcon } from "./icons/NotificationIcon"; // Importing the NotificationIcon component
import { HelpIcon } from "./icons/HelpIcon"; // Importing the HelpIcon component
import { AvatarIcon } from "./icons/AvatarIcon"; // Importing the AvatarIcon component

// UserControls component that renders icons and labels for user-related actions
export const UserControls: React.FC = () => {
  return (
    <div className={styles.userControls}> {/* Container for user control items */}

      {/* Notification control item */}
      <div className={styles.controlItem}>
        {/* Notification icon */}
        <NotificationIcon />
        {/* Label for the notification section */}
        <a href="/notifications" className={styles.controlLabel}>Notifications</a>
      </div>

      {/* Help control item */}
      <div className={styles.controlItem}>
        {/* Help icon */}
        <HelpIcon />
        {/* Label for the help section */}
        <span className={styles.controlLabel}>Help</span>
      </div>

      {/* User control item */}
      <div className={styles.controlItem}>
        {/* Avatar icon */}
        <AvatarIcon />
        {/* Link to the user profile */}
        <a href="/user" className={styles.controlLabel}>User</a>
      </div>
    </div>
  );
};

// Exporting the component for use in other parts of the app
export default UserControls;
