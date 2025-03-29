import React from "react";
import styles from "../styles.module.css";
import { Header } from "../Header";
import { Navigation } from "../Navigation";
import  ProfileLayout  from "./ProfileLayout";

const UserProfile: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image" >

         <ProfileLayout />

      </div>
    </div>
  );
};

export default UserProfile;
