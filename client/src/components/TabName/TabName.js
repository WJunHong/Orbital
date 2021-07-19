import React from "react";
import { Paper } from "../../design/table_icons";
import styles from "./TabName.module.css";

/**
 * The box containing the name of the page.
 */
const TabName = ({ name }) => {
  return (
    <Paper elevation={2} className={styles.overviewName}>
      {name}
    </Paper>
  );
};

export default TabName;
