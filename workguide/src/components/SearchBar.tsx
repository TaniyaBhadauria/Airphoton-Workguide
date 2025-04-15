"use client"; // Ensures client-side rendering for this component in Next.js

import React, { useState, useEffect } from "react"; // Importing React and hooks for state and effects
import icon from "./images/icon.png"; // Importing the search icon for the input field
import { useDispatch } from "react-redux"; // Importing useDispatch for dispatching Redux actions
import { setItemCode } from "../redux/itemCodeSlice"; // Importing the Redux action to set the item code
import styles from "./LibraryWorkshop.module.css"; // Importing the CSS module for styling

// SearchBar component where users can search for item codes and select from suggestions
export function SearchBar() {
  const [categories, setCategories] = useState<string[]>([]); // State to hold categories fetched from the API
  const [selectedCategory, setSelectedCategory] = useState(""); // State to track the selected category
  const [itemCodes, setItemCodes] = useState<string[]>([]); // State to hold item codes fetched from the API
  const [searchTerm, setSearchTerm] = useState<string>(""); // State to track the user's input in the search field
  const [filteredCodes, setFilteredCodes] = useState<string[]>([]); // State to hold the filtered item codes based on the search term
  const dispatch = useDispatch(); // Dispatch function to send actions to Redux store

  // Fetch categories from the API when the component mounts
  useEffect(() => {
    fetch("https://y-eta-lemon.vercel.app/get_directories?repo_owner=TaniyaBhadauria&repo_name=apps-wi")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data); // If the response is an array, set categories
        } else {
          console.error("Invalid response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Fetch item codes from the Flask API when the component mounts
  useEffect(() => {
    fetch("https://y-eta-lemon.vercel.app/get_item_codes")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItemCodes(data); // Store item codes if the response is valid
        } else {
          console.error("Invalid response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching item codes:", error));
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Filter item codes based on the search term input
  useEffect(() => {
    if (searchTerm) {
      const filtered = itemCodes.filter(code => code.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredCodes(filtered); // Set filtered codes based on the search term
    } else {
      setFilteredCodes([]); // If the search term is empty, clear the filtered codes
    }
  }, [searchTerm, itemCodes]); // Runs when searchTerm or itemCodes change

  // Handle the selection of a suggestion
  const handleSelect = (code: string) => {
    setSearchTerm(code); // Set the selected item code in the search input field
    setFilteredCodes([]); // Hide the suggestion list after selection
    dispatch(setItemCode(code)); // Dispatch the selected item code to the Redux store
  };

  // Handle the search button click
  const handleSearch = (code: string) => {
    dispatch(setItemCode(code)); // Dispatch the search term to the Redux store when the search button is clicked
  };

  return (
    <section className={styles.searchBarContainer}> {/* Container for the search bar */}
      <div className={styles.searchInput}> {/* Search input container */}
        <img
          src={icon} // Display the search icon
          alt="Search" // Alt text for accessibility
          className={styles.searchIcon} // Styling for the search icon
        />
        <input
          type="text"
          className="form-control" // Basic styling for the input field
          placeholder="Search item codes..." // Placeholder text for the search field
          value={searchTerm} // Bind the search term state to the input field
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
        {/* Show suggestions if there are filtered item codes */}
        {filteredCodes.length > 0 && (
          <ul className={styles.suggestions}> {/* Suggestions dropdown */}
            {filteredCodes.map((code, index) => (
              <li key={index} onClick={() => handleSelect(code)}> {/* Suggestion item */}
                {code} {/* Display the item code */}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dropdown for selecting a category */}
      <select
        className={styles.dropdown} // Styling for the dropdown
        value={selectedCategory} // Bind the selected category state to the dropdown value
        onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category on change
      >
        <option value="">Select a category</option> {/* Default option */}
        {/* Map through the categories and create dropdown options */}
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Search button that triggers the search */}
      <button className={styles.searchButton} onClick={() => handleSearch(searchTerm)}>
        Search {/* Button text */}
      </button>
    </section>
  );
}
