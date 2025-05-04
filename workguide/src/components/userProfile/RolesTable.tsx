import React from "react";
import styles from "./RolesTable.module.css";

export const RolesTable: React.FC = () => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const userId = userProfile.id;        // Adjust based on your actual API field
    const username = userProfile.username;
    const handleRequestRole = async (requestedRole: string) => {
        try {
          const response = await fetch("https://y-eta-lemon.vercel.app/request-role", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              username: username,
              requested_role: requestedRole,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            alert(data.message);
          } else {
            const error = await response.json();
            alert(error.error || "Failed to submit role request");
          }
        } catch (error) {
          console.error("Request failed:", error);
          alert("An error occurred while submitting request");
        }
      };
  return (
    <section className={styles.tableContainer}>
      <table className={styles.rolesTable}>
        <thead>
          <tr>
            <th className={styles.header}>Roles</th>
            <th className={styles.header}>Permissions</th>
            <th className={styles.header}>Request</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.cell}>Admin</td>
            <td className={styles.cell}>Create, Delete, Edit, View</td>
            <td className={styles.cellRequest} onClick={() => handleRequestRole("Admin")}>
                          Click to request
                        </td>
          </tr>
          <tr>
            <td className={styles.cell}>Intern</td>
            <td className={styles.cell}>View</td>
            <td className={styles.cellRequest} onClick={() => handleRequestRole("Intern")}>
                          Click to request
                        </td>
          </tr>
          <tr>
            <td className={styles.cell}>Technician</td>
            <td className={styles.cell}>Create, Edit, View</td>
            <td className={styles.cellRequest} onClick={() => handleRequestRole("Technician")}>
                          Click to request
                        </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
