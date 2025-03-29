"use client";
import * as React from "react";
import styles from "./LibraryWorkshop.module.css";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { SearchFooter } from "./SearchFooter";

export default function LibraryWorkshop() {
  return (
    <main className={styles.container}>
      <SearchBar />
      <SearchResults />
      <hr className={styles.divider} />
      <SearchFooter />
    </main>
  );
}
