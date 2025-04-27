import React, { useState, useEffect } from "react";
import styles from "../styles.module.css";
import { Header } from ".././Header";
import { Navigation } from ".././Navigation";
import libstyles from "../LibraryWorkshop.module.css";

interface OfflineItem {
  item_code: string;
  pdf: string; // base64 string
}

const OfflineMode: React.FC = () => {
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Retrieve data from localStorage
    const storedOfflineItems = localStorage.getItem('offlineItems');
    const storedDownloadLinks = localStorage.getItem('downloadLinks');

    if (storedOfflineItems && storedDownloadLinks) {
      // Parse and set the offline items and download links from localStorage
      const offlineItemsData: OfflineItem[] = JSON.parse(storedOfflineItems);
      const downloadLinksData: { [key: string]: string } = JSON.parse(storedDownloadLinks);

      setOfflineItems(offlineItemsData);
      setDownloadLinks(downloadLinksData);
    } else {
      // If no data is in localStorage, show a message or handle the scenario where data is missing
      console.warn("No offline items found in localStorage. The app might be running without any data.");
    }
  }, []); // This runs only once on component mount

  // Split items into two columns
  const mid = Math.ceil(offlineItems.length / 2);
  const leftColumn = offlineItems.slice(0, mid);
  const rightColumn = offlineItems.slice(mid);

  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image">
        <div className={styles.libHeading}>
          Offline Mode: You can access these PDFs without an internet connection.
        </div>

        <div className={libstyles.contentGrid}>
          <div className={libstyles.contentCard}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* Left Column */}
              <ul style={{ flex: 1, marginRight: "20px", listStyleType: "none", padding: 0 }}>
                {leftColumn.length > 0 ? (
                  leftColumn.map((item) => (
                    <li key={item.item_code} style={{ marginBottom: "10px" }}>
                      <strong>{item.item_code}</strong>
                      <br />
                      <a href={downloadLinks[item.item_code]} download={`${item.item_code}.pdf`}>
                        Download Instructions (PDF)
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No offline items available.</li>
                )}
              </ul>

              {/* Right Column */}
              <ul style={{ flex: 1, listStyleType: "none", padding: 0 }}>
                {rightColumn.length > 0 ? (
                  rightColumn.map((item) => (
                    <li key={item.item_code} style={{ marginBottom: "10px" }}>
                      <strong>{item.item_code}</strong>
                      <br />
                      <a href={downloadLinks[item.item_code]} download={`${item.item_code}.pdf`}>
                        Download Instructions (PDF)
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No offline items available.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;
