import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import styles from "./LibraryWorkshop.module.css";

export function SearchResults() {
  const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);
  const [allItems, setAllItems] = useState<any[]>([]); // Store all available items
  const [filteredItem, setFilteredItem] = useState<any | null>(null); // Store selected item details
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch all items on component load
  useEffect(() => {
    fetch(`http://54.211.232.182:5000/items`)
      .then((response) => response.json())
      .then((data) => {
        setAllItems(data); // Store all items
      })
      .catch((error) => {
        console.error("Error fetching all items:", error);
      });
  }, []);

   const handleItemClick = (itemId: string) => {
      // Navigate to the detail page with itemCode
      navigate(`/instructions`);
    };

  // Update filteredItem when itemCode changes
  useEffect(() => {
    if (itemCode && allItems.length > 0) {
      setIsSearching(true);
      const foundItem = allItems.find((item) => item.item_id.toString() === itemCode);
      if (foundItem) {
        setFilteredItem(foundItem);
      } else {
        setFilteredItem(null);
      }
      setIsSearching(false);
    }
  }, [itemCode, allItems]);

  return (
    <section className={styles.resultsContainer}>
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
        <p>Loading...</p>
      ) : filteredItem ? (
        <div>
          <h2 className={styles.resultsTitle}>Search Results</h2>
          <figure className={styles.resultsFigure}>
            <img
              src={`data:image/png;base64,${filteredItem.image_name}`}
              alt="Item"
              className={styles.resultsImage}
            />
            <figcaption
                          className={styles.resultsCaption}
                          onClick={() => handleItemClick(filteredItem.item_id)} // onClick to navigate
                        > {filteredItem.item_id}
            </figcaption>
          </figure>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          <figcaption className={styles.resultsCaption}>No items available</figcaption>
        </div>
      )}
    </section>
  );
}
