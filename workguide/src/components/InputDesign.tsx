import React from "react";
import styles from "./styles.module.css";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import  LibraryWorkshop  from "./LibraryWorkshop";

const InputDesign: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image" >
      <div className={styles.libHeading}>
              Library Workshop - Search, and access work instructions for all available products
      </div>
       <LibraryWorkshop />
      </div>
    </div>
  );
};

export default InputDesign;
