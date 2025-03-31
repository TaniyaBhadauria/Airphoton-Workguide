import React from "react";
import styles from "./styles.module.css";
import { NotificationIcon } from "./icons/NotificationIcon";
import { HelpIcon } from "./icons/HelpIcon";
import { AvatarIcon } from "./icons/AvatarIcon";

export const UserControls: React.FC = () => {
  return (
    <div className={styles.userControls}>
      <div className={styles.controlItem}>
        <NotificationIcon />
        <span className={styles.controlLabel}>Notifications</span>
      </div>
      <div className={styles.controlItem}>
        <HelpIcon />
        <span className={styles.controlLabel}>Help</span>
      </div>
      <div className={styles.controlItem}>
        <AvatarIcon />
        <a href="/user" className={styles.controlLabel}>User</a>
      </div>
    </div>
  );
};

export default UserControls;
