import React, { useState, useEffect } from "react";
import styles from "./ProfileInfo.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Define the type for user profile data
interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  profilepic: string | null; // Can be a base64 string or null if no picture is set
}

export const ProfileInfo: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");

  // Get the username from the Redux store
  const username = localStorage.getItem("username");

  // Get the active screen from the Redux store
  const activeScreen = useSelector((state: RootState) => state.userScreen.activeScreen);

  // Fetch user profile data from API
  useEffect(() => {
    if (!username) {
      setError("User is not logged in.");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://y-eta-lemon.vercel.app/api/user?username=${username}`);

        if (!response.ok) {
          throw new Error("User not found or an error occurred");
        }

        const data = await response.json();
        setUserProfile(data); // Store user data in state
      } catch (error: any) {
        setError(error.message); // Handle errors
      }
    };

    fetchUserProfile();
  }, [username]); // Fetch user data when the username changes

  // Render error message if something goes wrong
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className={styles.profileInfo}>
      {userProfile ? (
        <>
          <img
            src={userProfile.profilepic ? `data:image/png;base64,${userProfile.profilepic}` : "https://cdn.builder.io/api/v1/image/assets/TEMP/6876b92a217cbcff4fbbb8d2743c2e9a73cd9a74?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"}
            alt="Profile"
            className={styles.profileImage}
          />
          <div className={styles.details}>
            <div className={styles.info}>
              <strong>Name:</strong> {userProfile.username}
              <br />
              <br />
              <strong>Email:</strong> {userProfile.email}
              <br />
              <br />
              <strong>Current Role:</strong> {userProfile.role}
            </div>
          </div>

          {activeScreen === "My Profile" && (
            <div className={styles.editButtons}>
              <button className={styles.editButton}>Edit Profile</button>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
};
