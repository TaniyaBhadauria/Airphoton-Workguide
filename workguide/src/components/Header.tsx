import React from "react";
import styles from "./styles.module.css";
import logo from "./images/logo.png";
import UserControls from "./UserControls";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <img
        src={logo}
        alt="Logo"
        className={styles.logo}
      />
      <UserControls />
    </header>
  );
};
