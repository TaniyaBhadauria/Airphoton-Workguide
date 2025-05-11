import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import styles from "./LibraryWorkshop.module.css";
import { SearchFooter } from "./SearchFooter";
import { useDispatch } from "react-redux";
import { setItemCode } from "../redux/itemCodeSlice";

interface OfflineItem {
  item_code: string;
  pdf: string;
}

export function SearchResults() {
    const dispatch = useDispatch();
  const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);

  const [allItems, setAllItems] = useState<any[]>([]);
  const [filteredItem, setFilteredItem] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<{ [key: string]: string }>({});
  const [viewMode, setViewMode] = useState<"gallery" | "list">("gallery");
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
       dispatch(setItemCode(itemId));
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


  const renderGalleryView = () => (
  <div className={styles.headerRows}>
    <h5>Available Items</h5>
    <div className={styles.contentGrids}>
      {allItems.map((item, index) => (
        <div key={index} className={styles.galleryCard} onClick={() => handleItemClick(item.item_id)}>
          <img
            src={`data:image/png;base64,${item.image_name}`}
            alt={`Item ${item.item_id}`}
            className={styles.galleryImage}
          />
          <div className={styles.galleryCaption}>{item.item_id}</div>
        </div>
      ))}
    </div>
    </div>
  );

  const renderListView = () => (
  <div>
  <h5>Available Items</h5>
    <div className={styles.listContainer }>
      {allItems.map((item, index) => (
        <div key={index} className={styles.listItem} onClick={() => handleItemClick(item.item_id)}>
          <div className={styles.listText}>{item.item_id}</div>
        </div>
      ))}
    </div>
  </div>
  );

  return (
    <section className={styles.resultsContainer}>
    <div className={styles.headerRow}>
            <div className={styles.toggleButtons}>
              <button
                className={`${styles.toggleButton} ${viewMode === "gallery" ? styles.active : ""}`}
                onClick={() => setViewMode("gallery")}
              >
                Gallery
              </button>
              <button
                className={`${styles.toggleButton} ${viewMode === "list" ? styles.active : ""}`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>
      {!itemCode && allItems.length > 0 ? (
              viewMode === "gallery" ? renderGalleryView() : renderListView()
            ) : isSearching ? (
              <p>Loading...</p>
            ) : filteredItem ? (
        <div>
          <div className={styles.headerRows} >
            <h2 className={styles.resultsTitle}>Search Results</h2>
            <div className={`${styles.contentGrids} ${styles.shiftRight}`}>
              <div className={styles.galleryCard} onClick={() => handleItemClick(filteredItem.item_id)}>
                <img
                  src={`data:image/png;base64,${filteredItem.image_name}`}
                  alt={`Item ${filteredItem.item_id}`}
                  className={styles.galleryImage}
                />
                <div className={styles.galleryCaption}>{filteredItem.item_id}</div>
              </div>
            </div>
          </div>
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

