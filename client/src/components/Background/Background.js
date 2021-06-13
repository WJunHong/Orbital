import React from "react";
import styles from "./Background.module.css";

const Background = ({ children }) => {
  return <div className={styles.mainBody}>{children}</div>;
};
export default Background;
