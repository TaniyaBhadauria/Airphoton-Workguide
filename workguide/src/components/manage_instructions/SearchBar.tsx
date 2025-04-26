"use client";
import React, { useState, useEffect } from "react";
import icon from "../images/icon.png";
import styles from "./SearchBar.module.css";

export function SearchBar() {
  return (
    <section className={styles.searchBarContainer}>
      <div className={styles.searchInput}>
       <img
                src={icon}
                alt="Search"
                className={styles.searchIcon}
              />
      <input
                type="text"
                className="form-control"
                placeholder="Search..."
              />

      </div>

        <button className={styles.searchButton}>Search</button>

    </section>
  );
}
