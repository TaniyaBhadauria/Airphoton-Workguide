"use client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import styles from "./NavigationMenu.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveScreen } from "../../redux/userScreenSlice";
import { MenuItem } from "./MenuItem";

export const NavigationMenu: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate function
  const activeScreen = useSelector((state: RootState) => state.userScreen.activeScreen);

  // Automatically navigate to /notifications if activeScreen is 'Notification'
  useEffect(() => {
    if (activeScreen === "Notification") {
      navigate("/user-notifications"); // Redirect to the notifications page
    }
    if (activeScreen === "Log Out") {
          // Clear user data
          localStorage.removeItem("username");
          localStorage.removeItem("userProfile");

          // Redirect to login page or home page
          navigate("/"); // Redirect to login page (adjust path as needed)
        }
  }, [activeScreen, navigate]);

  return (
    <nav className={styles.navigation}>
      {[
        { label: "My Profile", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee3fef04fb7405d0421c30a05441d19215db836e?apiKey=60aae364d73645da910bcd623ed1d086", hasArrow: true },
        { label: "Notification", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/062477465219802ed17fa0cefa4f05fd9705737a?apiKey=60aae364d73645da910bcd623ed1d086" },
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
