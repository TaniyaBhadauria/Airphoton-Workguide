import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { Header } from "../Header";
import { Navigation } from "../Navigation";
import { RootState } from "../../redux/store";
import { SearchBar } from "./SearchBar";
import { Table } from "./Table";
import { useSelector } from "react-redux";
import FeedbackForm from "./InputDesign";
import Modal from "./Modal";

const EditInstructions: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
  };

  return (
    <div className={styles.maincontainer}>
      <Header />
      <Navigation />

      <div className={styles.heroImage} role="img" aria-label="Hero image">
        <button className={styles.createButton} onClick={handleCreateClick}>
          + Create new
        </button>
        <SearchBar />
        <Table />
      </div>

      {showForm && (
        <Modal onClose={handleCloseModal}>
          <FeedbackForm />
        </Modal>
      )}
    </div>
  );
};

export default EditInstructions;
