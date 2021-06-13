import React from "react";
import { Paper } from "@material-ui/core";
import styles from "./TabName.module.css";

const TabName = ({ name }) => {
  return (
    <Paper elevation={2} className={styles.overviewName}>
      {name}
    </Paper>
  );
};

export default TabName;
