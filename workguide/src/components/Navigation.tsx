import React, { useState, useEffect } from "react"; // Importing React and useState, useEffect hooks for managing state and lifecycle
import styles from "./styles.module.css"; // Importing CSS module for styling
import { MenuIcon } from "./icons/MenuIcon"; // Importing the MenuIcon component to be used in the navigation bar
import Switch from "react-switch"; // Importing the Switch component from react-switch
import { useNavigate } from "react-router-dom";

// Navigation component to display the navigation bar with links
export const Navigation: React.FC = () => {
  const [checked, setChecked] = useState<boolean>(navigator.onLine); // Default state based on the current network status
  const navigate = useNavigate();

  // Method to handle the toggle change
  const handleChange = (checked: boolean) => {
    setChecked(checked); // Update the state when the toggle switch is changed
    if (checked) {
        navigate("/lib"); // Go to main app when toggled to Online
      } else {
        navigate("/offline"); // Go to offline page when toggled to Offline
      }
    console.log("Toggle is now", checked ? "Online" : "Offline"); // For debugging or logging purposes
  };

  // Method to handle network status change
  const handleOnlineStatus = () => {
    setChecked(true); // Set the toggle to checked (Online) when the network becomes available
    navigate("/lib");
  };

  const handleOfflineStatus = () => {
    setChecked(false); // Set the toggle to unchecked (Offline) when the network is disconnected
    navigate("/offline");
  };

  // Set up event listeners for online/offline events
  useEffect(() => {
    window.addEventListener("online", handleOnlineStatus); // Listen for the online event
    window.addEventListener("offline", handleOfflineStatus); // Listen for the offline event

    // Cleanup the event listeners when the component is unmounted
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
    };
  }, []);

  return (
    <nav className={styles.navigationBar}>
      {/* Main container for the navigation bar */}
      <div className={styles.navigationContent}>
        <MenuIcon /> {/* The icon representing the menu */}
        <div className={styles.menuItems}>
          {/* Navigation links for different sections */}
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

        {/* Toggle Switch aligned to the right */}
        <div className={styles.toggleContainer}>
          <Switch
            checked={checked} // Control switch based on network status
            onChange={handleChange}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
            id="material-switch"
          />
        </div>
      </div>
    </nav>
  );
};
