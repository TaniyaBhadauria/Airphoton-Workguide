import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import styles from "./LibraryWorkshop.module.css";

interface OfflineItem {
  item_code: string;
  pdf: string; // base64 string
}

export function SearchResults() {
  const itemCode = useSelector((state: RootState) => state.itemCode.itemCode);
  const [allItems, setAllItems] = useState<any[]>([]); // Store all available items
  const [filteredItem, setFilteredItem] = useState<any | null>(null); // Store selected item details
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

   useEffect(() => {
      const fetchItems = async () => {
        try {
          // Fetch all items first
          const allItemsResponse = await fetch("https://y-eta-lemon.vercel.app/items");
          const allItemsData = await allItemsResponse.json();

          // Fetch offline items second
          const offlineItemsResponse = await fetch("https://y-eta-lemon.vercel.app/api/getInstructionPdfs");
          const offlineItemsData: OfflineItem[] = await offlineItemsResponse.json();

          // Process offline items to create download links
          const offlineLinks: { [key: string]: string } = {};
          for (const item of offlineItemsData) {
            const byteCharacters = atob(item.pdf);
            const byteNumbers = new Array(byteCharacters.length)
              .fill(0)
              .map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);
            offlineLinks[item.item_code] = blobUrl;
          }

          // Update state with the fetched data
          setAllItems(allItemsData);
          setOfflineItems(offlineItemsData);
          setDownloadLinks(offlineLinks);
          localStorage.setItem('offlineItems', JSON.stringify(offlineItemsData));
          localStorage.setItem('downloadLinks', JSON.stringify(offlineLinks));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchItems();
    }, []); // Empty dependency array means this runs once when the component is mounted

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
