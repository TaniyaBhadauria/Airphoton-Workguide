"use client";
import React from "react";
import styles from "./MenuItem.module.css";

interface MenuItemProps {
  icon: string;
  label: string;
  hasArrow?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  hasArrow = false,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.content}>
        <img src={icon} alt="" className={styles.icon} />
        <span className={styles.label}>{label}</span>
      </div>
      {hasArrow && (
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ce2efcbfe21d6160fc1bea51f7ec6b024f2d175e?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"
          alt=""
          className={styles.arrow}
        />
      )}
    </button>
  );
};
