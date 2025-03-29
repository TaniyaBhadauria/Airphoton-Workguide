import React from "react";
import styles from "./styles.module.css";
import { MenuIcon } from "./icons/MenuIcon";

export const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigationBar}>
      <div className={styles.navigationContent}>
        <MenuIcon />
        <div className={styles.menuItems}>
          <a href="#" className={styles.menuLink}>
            Home
          </a>
          <a href="#" className={styles.menuLink}>
            Library
          </a>
          <a href="#" className={styles.menuLink}>
            Manage Instructions
          </a>
          <a href="#" className={styles.menuLink}>
            Change Log
          </a>
        </div>
      </div>
    </nav>
  );
};
