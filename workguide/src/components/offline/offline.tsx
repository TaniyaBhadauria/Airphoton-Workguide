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
    const fetchOfflineItems = async () => {
      try {
        const response = await fetch("https://y-eta-lemon.vercel.app/api/getInstructionPdfs");
        const data: OfflineItem[] = await response.json();

        const links: { [key: string]: string } = {};
        for (const item of data) {
          const byteCharacters = atob(item.pdf);
          const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const blobUrl = URL.createObjectURL(blob);
          links[item.item_code] = blobUrl;
        }

        setOfflineItems(data);
        setDownloadLinks(links);
      } catch (error) {
        console.error("Failed to fetch PDFs:", error);
      }
    };

    fetchOfflineItems();
  }, []);

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
                {leftColumn.map((item) => (
                  <li key={item.item_code} style={{ marginBottom: "10px" }}>
                    <strong>{item.item_code}</strong>
                    <br />
                    <a href={downloadLinks[item.item_code]} download={`${item.item_code}.pdf`}>
                      Download Instructions (PDF)
                    </a>
                  </li>
                ))}
              </ul>

              {/* Right Column */}
              <ul style={{ flex: 1, listStyleType: "none", padding: 0 }}>
                {rightColumn.map((item) => (
                  <li key={item.item_code} style={{ marginBottom: "10px" }}>
                    <strong>{item.item_code}</strong>
                    <br />
                    <a href={downloadLinks[item.item_code]} download={`${item.item_code}.pdf`}>
                      Download Instructions (PDF)
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;
