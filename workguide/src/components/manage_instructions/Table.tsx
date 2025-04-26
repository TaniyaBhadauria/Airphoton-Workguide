"use client";
import React, { useState, useEffect } from "react";
import icon from "../images/icon.png";
import styles from "./SearchBar.module.css";

type Item = {
  image_name: string;
  item_id: string;
};

type CommitInfo = {
  file_path: string;
  item_code: string;
  item_name: string;
  last_commit?: {
    author: string;
    date: string;
    message: string;
  };
};

export function SearchableTable() {
  const [items, setItems] = useState<CommitInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchItemsWithCommit = async () => {
      try {
        const res = await fetch("https://y-eta-lemon.vercel.app/items");
        const itemList: Item[] = await res.json();

        const itemData = await Promise.all(
          itemList.map(async (item) => {
            const commitRes = await fetch(
              `https://y-eta-lemon.vercel.app/check-item-code?target_code=${encodeURIComponent(item.item_id)}`
            );
            const commitInfo = await commitRes.json();
            return {
              ...item,
              ...commitInfo,
            };
          })
        );

        setItems(itemData);
      } catch (error) {
        console.error("Error fetching items or commit info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemsWithCommit();
  }, []);

  const filteredItems = items.filter((item) =>
    item.item_code?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <section>
      <div className={styles.searchBarContainer}>
        <div className={styles.searchInput}>
          <img src={icon} alt="Search" className={styles.searchIcon} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by Item Code..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <button className={styles.searchButton}>Search</button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading items...</div>
        ) : (
          <table className={styles.rolesTable}>
            <thead>
              <tr>
                <th className={styles.header}>Item Code</th>
                <th className={styles.header}>Last Edited</th>
                <th className={styles.header}>Last Edited By</th>
                <th className={styles.header}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index}>
                  <td className={styles.cell}>{item.item_code}</td>
                  <td className={styles.cell}>
                    {item.last_commit?.date
                      ? new Date(item.last_commit.date).toLocaleString()
                      : "Not available"}
                  </td>
                  <td className={styles.cell}>{item.last_commit?.author}</td>
                  <td className={styles.cellRequest}>
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
                      "N/A"
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
