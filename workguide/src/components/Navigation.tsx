import React from "react";
import styles from "./styles.module.css";
import { MenuIcon } from "./icons/MenuIcon";

export const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigationBar}>
      <div className={styles.navigationContent}>
        <MenuIcon />
        <div className={styles.menuItems}>
          <a href="/lib" className={styles.menuLink}>
            Home
          </a>
          <a href="/lib" className={styles.menuLink}>
            Library
          </a>
          <a href="/feedbacks" className={styles.menuLink}>
            Manage Feedback
          </a>
          <a href="/versions" className={styles.menuLink}>
            Change Log
          </a>
        </div>
      </div>
    </nav>
  );
};
