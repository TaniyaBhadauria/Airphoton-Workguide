"use client";
import React, { useState, useEffect } from "react";
import styles from "../manage_instructions/SearchBar.module.css"; // using same styles
import icon from "../images/icon.png";
import { Header } from "../Header";
import { Navigation } from "../Navigation";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

type NotificationItem = {
  id: number;
  user_id: number;
  username: string;
  requested_role: string;
  status: string;
  created_at: string;
};

const UserNotification: React.FC = () => {
  const username = localStorage.getItem("username");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`https://y-eta-lemon.vercel.app/approved-notifications?username=${username}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch notifications");
        }
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchNotifications(); // This line was missing
    }
  }, [username]); // Ensures it runs again if `username` changes

  const filteredNotifications = notifications.filter((notif) =>
    notif.requested_role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <section>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image">
      <div className={styles.searchBarContainer}>
        <div className={styles.searchInput}>
          <img src={icon} alt="Search" className={styles.searchIcon} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by Role..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <button className={styles.searchButton}>Search</button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading notifications...</div>
        ) : (
          <table className={styles.rolesTable}>
            <thead>
              <tr>
                <th className={styles.header}>Username</th>
                <th className={styles.header}>Requested Role</th>
                <th className={styles.header}>Status</th>
                <th className={styles.header}>Requested On</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((notif) => (
                <tr key={notif.id}>
                  <td className={styles.cell}>{notif.username}</td>
                  <td className={styles.cell}>{notif.requested_role}</td>
                  <td className={styles.cell}>{notif.status}</td>
                  <td className={styles.cell}>{notif.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </section>
  );
};

export default UserNotification;
