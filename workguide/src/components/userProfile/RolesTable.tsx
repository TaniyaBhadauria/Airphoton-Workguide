import React from "react";
import styles from "./RolesTable.module.css";

export const RolesTable: React.FC = () => {
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
            <td className={styles.cellRequest}>Click to request</td>
          </tr>
          <tr>
            <td className={styles.cell}>Intern</td>
            <td className={styles.cell}>Create, Delete, Edit</td>
            <td className={styles.cellRequest}>Click to request</td>
          </tr>
          <tr>
            <td className={styles.cell}>Technician</td>
            <td className={styles.cell}>View</td>
            <td className={styles.cellRequest}>Click to request</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
