import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import styles from "./LibraryWorkshop.module.css";

// Interface for offline item that contains item_code and a base64-encoded PDF
interface OfflineItem {
  item_code: string;
  pdf: string; // Base64 string representing the PDF
}

export function SearchResults() {
  // Accessing the Redux state to get the itemCode
  const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);

  // States for managing item data, search, offline items, and download links
  const [allItems, setAllItems] = useState<any[]>([]); // Store all available items
  const [filteredItem, setFilteredItem] = useState<any | null>(null); // Store selected item details
  const [isSearching, setIsSearching] = useState<boolean>(false); // Track if the search is in progress
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]); // Store offline items (PDFs)
  const [downloadLinks, setDownloadLinks] = useState<{ [key: string]: string }>({}); // Store download links for offline PDFs
  const navigate = useNavigate(); // Navigation hook for routing

  // Fetch data when the component is mounted
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await fetch("https://y-eta-lemon.vercel.app/items");
        const data = await response.json();
        setAllItems(data);
      } catch (error) {
        console.error("Error fetching all items:", error);
      }
    };

    const fetchOfflineItems = async () => {
      try {
        const response = await fetch("https://y-eta-lemon.vercel.app/api/getInstructionPdfs");
        const data: OfflineItem[] = await response.json();

        const offlineLinks: { [key: string]: string } = {};
        for (const item of data) {
          const byteCharacters = atob(item.pdf);
          const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const blobUrl = URL.createObjectURL(blob);
          offlineLinks[item.item_code] = blobUrl;
        }

        setOfflineItems(data);
        setDownloadLinks(offlineLinks);
        localStorage.setItem('offlineItems', JSON.stringify(data));
        localStorage.setItem('downloadLinks', JSON.stringify(offlineLinks));
      } catch (error) {
        console.error("Error fetching offline items:", error);
      }
    };

    fetchAllItems();         // Immediate for search
    fetchOfflineItems();     // Async in background
  }, []);

  // Handle item click (navigate to the details page for the selected item)
  const handleItemClick = (itemId: string) => {
    navigate(`/instructions`); // Navigate to the instructions page
  };

  // Update filteredItem when itemCode changes
  useEffect(() => {
    if (itemCode && allItems.length > 0) {
      setIsSearching(true); // Set searching state to true while searching
      const foundItem = allItems.find((item) => item.item_id.toString() === itemCode); // Find item by itemCode
      if (foundItem) {
        setFilteredItem(foundItem); // Set filtered item if found
      } else {
        setFilteredItem(null); // Reset filtered item if not found
      }
      setIsSearching(false); // Set searching state to false after search is completed
    }
  }, [itemCode, allItems]); // Runs whenever itemCode or allItems changes

  return (
    <section className={styles.resultsContainer}>
      {/* Display available items if itemCode is not provided */}
      {!itemCode && allItems.length > 0 ? (
        <div className={styles.contentGrid}>
          <div className={styles.contentCard}>
            <div className={styles.cardGrid}>
              <div className={styles.libHeading}>Available Items</div>
              {allItems.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div className={styles.libHeading}>{item.item_id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isSearching ? (
        // Show loading message while searching
        <p>Loading...</p>
      ) : filteredItem ? (
        // Display search results if a matching item is found
        <div>
          <h2 className={styles.resultsTitle}>Search Results</h2>
          <figure className={styles.resultsFigure}>
            <img
              src={`data:image/png;base64,${filteredItem.image_name}`} // Display item image
              alt="Item"
              className={styles.resultsImage}
            />
            <figcaption
              className={styles.resultsCaption}
              onClick={() => handleItemClick(filteredItem.item_id)} // onClick to navigate to details page
            >
              {filteredItem.item_id} {/* Display item ID */}
            </figcaption>
          </figure>
        </div>
      ) : (
        // Display message when no items are available
        <div className={styles.contentGrid}>
          <figcaption className={styles.resultsCaption}>No items available</figcaption>
        </div>
      )}
    </section>
  );
}
