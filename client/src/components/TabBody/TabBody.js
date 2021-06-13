import React from "react";
import styles from "./TabBody.module.css";
import "../../design/TaskBox.css";
import { Paper } from "@material-ui/core";

const TabBody = ({ children }) => {
  return (
    <Paper elevation={2} className={styles.overviewBox}>
      {children}
    </Paper>
  );
};

export default TabBody;
