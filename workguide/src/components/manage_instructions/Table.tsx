"use client"; // Directive for client-side rendering in Next.js (if applicable)
import React, { useState, useEffect } from "react"; // Importing necessary React hooks
import icon from "../images/icon.png"; // Importing the search icon image
import styles from "./SearchBar.module.css"; // Importing CSS module for styling

// Defining the structure of an Item object
type Item = {
  image_name: string;
  item_id: string;
};

// Defining the structure of CommitInfo for each item
type CommitInfo = {
  file_path: string; // File path for the item
  item_code: string; // Code of the item
  item_name: string; // Name of the item
  last_commit?: { // Optional property to hold commit details
    author: string; // Author of the last commit
    date: string; // Date of the last commit
    message: string; // Commit message
  };
};

export function SearchableTable() {
  // State hooks to manage items, loading state, and search text
  const [items, setItems] = useState<CommitInfo[]>([]); // Stores items with commit info
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [searchText, setSearchText] = useState(""); // Holds the search input text

  // useEffect hook to fetch items and commit info on component mount
  useEffect(() => {
    const fetchItemsWithCommit = async () => {
      try {
        // Fetching the list of items from the API
        const res = await fetch("https://y-eta-lemon.vercel.app/items");
        const itemList: Item[] = await res.json(); // Parsing the response JSON

        // Fetching commit info for each item in parallel using Promise.all
        const itemData = await Promise.all(
          itemList.map(async (item) => {
            const commitRes = await fetch(
              `https://y-eta-lemon.vercel.app/check-item-code?target_code=${encodeURIComponent(item.item_id)}`
            );
            const commitInfo = await commitRes.json();
            return {
              ...item,
              ...commitInfo, // Merging item data with commit info
            };
          })
        );

        // Storing the fetched data in state
        setItems(itemData);
      } catch (error) {
        console.error("Error fetching items or commit info:", error); // Handling errors
      } finally {
        setLoading(false); // Setting loading to false after the data is fetched
      }
    };

    fetchItemsWithCommit(); // Invoking the function to fetch data
  }, []); // Empty dependency array to run only once on component mount

  // Filtering the items based on the search text
  const filteredItems = items.filter((item) =>
    item.item_code?.toLowerCase().includes(searchText.toLowerCase()) // Case-insensitive search
  );

  return (
    <section>
      {/* Search bar container */}
      <div className={styles.searchBarContainer}>
        <div className={styles.searchInput}>
          <img src={icon} alt="Search" className={styles.searchIcon} /> {/* Search icon */}
          <input
            type="text"
            className="form-control"
            placeholder="Search by Item Code..." // Placeholder text for search input
            value={searchText} // Binding input value to state
            onChange={(e) => setSearchText(e.target.value)} // Updating search text on input change
          />
        </div>
        <button className={styles.searchButton}>Search</button> {/* Search button */}
      </div>

      {/* Table container */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading items...</div> // Displayed while loading
        ) : (
          <table className={styles.rolesTable}>
            <thead>
              {/* Table headers */}
              <tr>
                <th className={styles.header}>Item Code</th>
                <th className={styles.header}>Last Edited</th>
                <th className={styles.header}>Last Edited By</th>
                <th className={styles.header}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapping through filtered items to display in table rows */}
              {filteredItems.map((item, index) => (
                <tr key={index}>
                  {/* Table cells displaying item information */}
                  <td className={styles.cell}>{item.item_code}</td>
                  <td className={styles.cell}>
                    {/* Displaying the formatted commit date or "Not available" */}
                    {item.last_commit?.date
                      ? new Date(item.last_commit.date).toLocaleString()
                      : "Not available"}
                  </td>
                  <td className={styles.cell}>{item.last_commit?.author}</td>
                  <td className={styles.cellRequest}>
                    {/* Link to edit item in GitHub if file path is available */}
                    {item.file_path ? (
                      <a
                        href={`https://github.com/TaniyaBhadauria/apps-wi/edit/master/${item.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.editLink}
                      >
                        Edit
                      </a>
                    ) : (
                      "N/A" // Display "N/A" if no file path is available
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
