"use client";
import React, { useState } from "react";
import styles from "./NavigationMenu.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveScreen } from "../../redux/userScreenSlice";
import { MenuItem } from "./MenuItem";

export const NavigationMenu: React.FC = () => {
  const dispatch = useDispatch();
  const activeScreen = useSelector((state: RootState) => state.userScreen.activeScreen);

  return (
    <nav className={styles.navigation}>
      {[
        { label: "My Profile", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee3fef04fb7405d0421c30a05441d19215db836e?apiKey=60aae364d73645da910bcd623ed1d086", hasArrow: true },
        { label: "Notification", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/062477465219802ed17fa0cefa4f05fd9705737a?apiKey=60aae364d73645da910bcd623ed1d086" },
        { label: "Settings", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/63ecfa35a0a7e7b967904715a911a791b69fadfc?apiKey=60aae364d73645da910bcd623ed1d086", hasArrow: true },
        { label: "Log Out", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b4fc1537973a7b62431af7a38f03430e75c71ad4?apiKey=60aae364d73645da910bcd623ed1d086" },
      ].map((item) => (
        <MenuItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          hasArrow={item.hasArrow}
          isActive={activeScreen === item.label} // Check if it's active
          onClick={() => dispatch(setActiveScreen(item.label))}
        />
      ))}
    </nav>
  );
};
