"use client";
import React from "react";
import styles from "./ProfileLayout.module.css";
import { NavigationMenu } from "./NavigationMenu";
import { ProfileInfo } from "./ProfileInfo";
import { RolesTable } from "./RolesTable";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


export const ProfileLayout: React.FC = () => {
         const activeScreen = useSelector((state: RootState) => state.userScreen.activeScreen);
  return (
    <main className={styles.layout}>
      <div className={styles.container}>
        <NavigationMenu />
        <section className={styles.content}>
          <ProfileInfo />
          <RolesTable />
        </section>
      </div>
    </main>
  );
};

export default ProfileLayout;
