import React from "react";
import styles from "./SearchBar.module.css";

export const Table: React.FC = () => {
  return (
    <section className={styles.tableContainer}>
      <table className={styles.rolesTable}>
        <thead>
          <tr>
            <th className={styles.header}>Work Instruction</th>
            <th className={styles.header}>Item Code</th>
            <th className={styles.header}>Last Edited</th>
            <th className={styles.header}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.cell}>Admin</td>
            <td className={styles.cell}>Create, Delete, Edit, View</td>
            <td className={styles.cellRequest}>Click to request</td>
            <td className={styles.cellRequest}>Edit</td>
          </tr>
          <tr>
            <td className={styles.cell}>Intern</td>
            <td className={styles.cell}>Create, Delete, Edit</td>
            <td className={styles.cellRequest}>Click to request</td>
            <td className={styles.cellRequest}>Edit</td>
          </tr>
          <tr>
            <td className={styles.cell}>Technician</td>
            <td className={styles.cell}>View</td>
            <td className={styles.cellRequest}>Click to request</td>
            <td className={styles.cellRequest}>Edit</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
