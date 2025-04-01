"use client";
import React, { useState, useEffect } from "react";
import icon from "./images/icon.png";
import { useDispatch } from "react-redux";
import { setItemCode } from "../redux/itemCodeSlice";
import styles from "./LibraryWorkshop.module.css";

export function SearchBar() {
  const [categories, setCategories] =useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemCodes, setItemCodes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCodes, setFilteredCodes] = useState<string[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
      // Fetch categories from the API
      fetch("http://54.211.232.182:5000/get_directories?repo_owner=TaniyaBhadauria&repo_name=apps-wi")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCategories(data); // Set categories if the API response is an array
          } else {
            console.error("Invalid response format:", data);
          }
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }, []);

  useEffect(() => {
      // Fetch item codes from Flask API
      fetch("http://54.211.232.182:5000/get_item_codes")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setItemCodes(data); // Store item codes
          } else {
            console.error("Invalid response format:", data);
          }
        })
        .catch((error) => console.error("Error fetching item codes:", error));
    }, []);

    // Filter item codes based on user input
  useEffect(() => {
    if (searchTerm) {
      const filtered = itemCodes.filter(code => code.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredCodes(filtered);
    } else {
      setFilteredCodes([]);
    }
  }, [searchTerm, itemCodes]);

  // Handle selection of a suggestion
    const handleSelect = (code: string) => {
      setSearchTerm(code); // Set the selected item in the search input
      setFilteredCodes([]); // Hide the suggestions after selection
      dispatch(setItemCode(code));
    };

  const handleSearch = (code: string) => {
      dispatch(setItemCode(code));
    };

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
                placeholder="Search item codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {filteredCodes.length > 0 && (
                <ul className={styles.suggestions}>
                  {filteredCodes.map((code, index) => (
                    <li key={index} onClick={() => handleSelect(code)}>
                      {code}
                    </li>
                  ))}
                </ul>
              )}
      </div>
     <select
             className={styles.dropdown}
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
           >
             <option value="" >Select a category</option>
             {categories.map((category, index) => (
               <option key={index} value={category}>
                 {category}
               </option>
             ))}
     </select>

      <button className={styles.searchButton} onClick={() => handleSearch(searchTerm)}>Search</button>
    </section>
  );
}
