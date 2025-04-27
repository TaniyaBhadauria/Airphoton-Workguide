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
    const fetchItems = async () => {
      try {
        // Fetch all items first
        const allItemsResponse = await fetch("https://y-eta-lemon.vercel.app/items");
        const allItemsData = await allItemsResponse.json();

        // Fetch offline items (PDFs) second
        const offlineItemsResponse = await fetch("https://y-eta-lemon.vercel.app/api/getInstructionPdfs");
        const offlineItemsData: OfflineItem[] = await offlineItemsResponse.json();

        // Process offline items to create download links (from base64)
        const offlineLinks: { [key: string]: string } = {};
        for (const item of offlineItemsData) {
          const byteCharacters = atob(item.pdf); // Decode base64 string to characters
          const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i)); // Convert characters to byte numbers
          const byteArray = new Uint8Array(byteNumbers); // Create Uint8Array from byte numbers
          const blob = new Blob([byteArray], { type: "application/pdf" }); // Create Blob from the byte array
          const blobUrl = URL.createObjectURL(blob); // Generate a URL for the Blob (to download the file)
          offlineLinks[item.item_code] = blobUrl; // Store the Blob URL for each item
        }

        // Update state with the fetched data
        setAllItems(allItemsData); // Set all items in state
        setOfflineItems(offlineItemsData); // Set offline items in state
        setDownloadLinks(offlineLinks); // Set download links for offline PDFs
        localStorage.setItem('offlineItems', JSON.stringify(offlineItemsData)); // Save offline items to localStorage
        localStorage.setItem('downloadLinks', JSON.stringify(offlineLinks)); // Save download links to localStorage
      } catch (error) {
        console.error("Error fetching data:", error); // Log errors if data fetching fails
      }
    };

    fetchItems(); // Call the fetchItems function
  }, []); // Empty dependency array means this runs once when the component is mounted

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
