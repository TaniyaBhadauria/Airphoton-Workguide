import React from "react";
import styles from "./ProfileInfo.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const ProfileInfo: React.FC = () => {
  const activeScreen = useSelector((state: RootState) => state.userScreen.activeScreen);
  return (
    <section className={styles.profileInfo}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6876b92a217cbcff4fbbb8d2743c2e9a73cd9a74?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"
        alt="Profile"
        className={styles.profileImage}
      />
      <div className={styles.details}>
        <div className={styles.info}>
          Name: John Doe
          <br />
          <br />
          Email: John_Doe@gmail.com
          <br />
          <br />
          Current Role: Technician
        </div>
      </div>
      {activeScreen === "My Profile" && (
              <div className={styles.editButtons}>
                <button className={styles.editButton}>Edit Profile</button>
              </div>
            )}
    </section>
  );
};
