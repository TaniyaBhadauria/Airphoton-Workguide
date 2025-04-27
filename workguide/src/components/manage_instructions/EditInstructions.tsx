import React, { useState } from "react"; // Importing React and useState for managing state
import styles from "./SearchBar.module.css"; // Importing the CSS module for styling
import { Header } from "../Header"; // Importing the Header component
import { Navigation } from "../Navigation"; // Importing the Navigation component
import { RootState } from "../../redux/store"; // Importing RootState for Redux state management (if needed)
import { SearchBar } from "./SearchBar"; // Importing the SearchBar component
import { SearchableTable } from "./Table"; // Importing the SearchableTable component
import { useSelector } from "react-redux"; // Importing useSelector to access Redux state (if needed)
import FeedbackForm from "./InputDesign"; // Importing the FeedbackForm component for input design
import Modal from "./Modal"; // Importing the Modal component for displaying a form in a modal

const EditInstructions: React.FC = () => {
  const [showForm, setShowForm] = useState(false); // State hook to toggle visibility of the modal

  // Function to show the modal when the 'Create new' button is clicked
  const handleCreateClick = () => {
    setShowForm(true);
  };

  // Function to hide the modal when the close button is clicked
  const handleCloseModal = () => {
    setShowForm(false);
  };

  return (
    <div className={styles.maincontainer}> {/* Main container for the page layout */}
      <Header /> {/* Rendering the Header component */}
      <Navigation /> {/* Rendering the Navigation component */}

      <div className={styles.heroImage} role="img" aria-label="Hero image"> {/* Hero image with an accessible label */}
        {/* Button to trigger the creation of a new item (opens modal) */}
        <button className={styles.createButton} onClick={handleCreateClick}>
          + Create new
        </button>
        <SearchableTable /> {/* Rendering the SearchableTable component */}
      </div>

      {/* Conditionally render the Modal with the FeedbackForm inside if showForm is true */}
      {showForm && (
        <Modal onClose={handleCloseModal}> {/* Passing onClose prop to Modal */}
          <FeedbackForm onClose={handleCloseModal} /> {/* Passing onClose prop to FeedbackForm */}
        </Modal>
      )}
    </div>
  );
};

export default EditInstructions; // Export the EditInstructions component to use elsewhere
