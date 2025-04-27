"use client";
import React, { useState, useEffect } from "react";
import styles from "../manage_instructions/SearchBar.module.css"; // Importing styles for the search bar and table
import icon from "../images/icon.png"; // Importing the search icon image
import { Header } from "../Header"; // Importing the Header component for the page layout
import { Navigation } from "../Navigation"; // Importing the Navigation component for the page navigation
import { RootState } from "../../redux/store"; // Redux store (unused in this code but imported for potential future use)
import { useSelector } from "react-redux"; // Redux hook to get the state (currently not used in this component)

type NotificationItem = {
  id: number; // Unique ID for the notification
  user_id: number; // ID of the user requesting the role change
  username: string; // Username of the user making the request
  requested_role: string; // Role requested by the user
  status: string; // Status of the request (Pending, Approved, Rejected)
  created_at: string; // Date when the request was made
};

const Notification: React.FC = () => {
  // Getting the username from local storage (assuming it is saved on login)
  const username = localStorage.getItem("username");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]); // State to hold the list of notifications
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [searchText, setSearchText] = useState(""); // State to manage search text for filtering notifications

  // Fetch notifications from the server when the component mounts or when username changes
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Making an API call to fetch pending notifications for the logged-in user
        const res = await fetch(`https://y-eta-lemon.vercel.app/pending-notifications?username=${username}`);

        // Check if the response is successful
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch notifications");
        }

        // Parsing the response data and updating the state
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        // Handling errors (e.g., network issues, API failure)
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Set loading to false once the data has been fetched
      }
    };

    // If a username is available, fetch the notifications
    if (username) {
      fetchNotifications();
    }
  }, [username]); // Dependency array ensures fetch is triggered when the username changes

  // Filter notifications based on the search text entered by the user
  const filteredNotifications = notifications.filter((notif) =>
    notif.username.toLowerCase().includes(searchText.toLowerCase()) // Case-insensitive search by username
  );

  // Method to update the status of a notification (approve or reject)
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      // Sending a request to update the notification's status
      const res = await fetch("https://y-eta-lemon.vercel.app/update-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }), // Sending the ID and new status in the request body
      });

      // Check if the response is successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      // Update the local state after successful status update
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, status: newStatus } : notif // Updating the notification status
        )
      );
    } catch (error) {
      // Handle errors if the status update fails
      console.error("Error updating notification:", error);
    }
  };

  return (
    <section>
      <Header /> {/* Render the header component */}
      <Navigation /> {/* Render the navigation component */}
      <div className={styles.heroImage} role="img" aria-label="Hero image"> {/* Hero image section */}
        <div className={styles.searchBarContainer}> {/* Container for search bar */}
          <div className={styles.searchInput}> {/* Search input section */}
            <img src={icon} alt="Search" className={styles.searchIcon} /> {/* Search icon */}
            <input
              type="text"
              className="form-control"
              placeholder="Search by Username..."
              value={searchText} // Controlled component for search text
              onChange={(e) => setSearchText(e.target.value)} // Update searchText on user input
            />
          </div>
          <button className={styles.searchButton}>Search</button> {/* Search button (no action defined) */}
        </div>

        <div className={styles.tableContainer}>
          {/* Conditional rendering based on the loading state */}
          {loading ? (
            <div className={styles.loading}>Loading notifications...</div> // Display loading message while fetching
          ) : (
            <table className={styles.rolesTable}>
              <thead>
                <tr>
                  <th className={styles.header}>Username</th>
                  <th className={styles.header}>Requested Role</th>
                  <th className={styles.header}>Status</th>
                  <th className={styles.header}>Requested On</th>
                  <th className={styles.header}>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Render filtered notifications */}
                {filteredNotifications.map((notif) => (
                  <tr key={notif.id}>
                    <td className={styles.cell}>{notif.username}</td>
                    <td className={styles.cell}>{notif.requested_role}</td>
                    <td className={styles.cell}>{notif.status}</td>
                    <td className={styles.cell}>{notif.created_at}</td>
                    <td className={styles.cellRequest}>
                      {/* Render approve/reject buttons only if the status is "Pending" */}
                      {notif.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(notif.id, "Approved")} // Approve button
                            style={{ marginRight: "10px" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(notif.id, "Rejected")} // Reject button
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        notif.status // Display status if it's not pending
                      )}
                    </td>
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

export default Notification; // Exporting the Notification component
