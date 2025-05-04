import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import styles from "./LibraryWorkshop.module.css";
import { SearchFooter } from "./SearchFooter";

interface OfflineItem {
  item_code: string;
  pdf: string;
}

export function SearchResults() {
  const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);

  const [allItems, setAllItems] = useState<any[]>([]);
  const [filteredItem, setFilteredItem] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

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

    fetchAllItems();
    fetchOfflineItems();
  }, []);

  const handleItemClick = (itemId: string) => {
    navigate(`/instructions`);
  };

  useEffect(() => {
    if (itemCode && allItems.length > 0) {
      setIsSearching(true);
      const foundItem = allItems.find((item) => item.item_id.toString() === itemCode);
      setFilteredItem(foundItem || null);
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
              onClick={() => handleItemClick(filteredItem.item_id)}
            >
              {filteredItem.item_id}
            </figcaption>
          </figure>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          <figcaption className={styles.resultsCaption}>No items available</figcaption>
        </div>
      )}

      {/* Horizontal line to separate the main content and footer */}
      <hr className={styles.divider} />

      {/* ✅ Add SearchFooter at the bottom */}
      <SearchFooter resultCount={itemCode ? (filteredItem ? 1 : 0) : allItems.length} />
    </section>
  );
}

