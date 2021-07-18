// Basic imports
import React from "react";
import styles from "./Background.module.css";

// Rendering the children inside the background div
const Background = ({ children }) => {
  return <div className={styles.mainBody}>{children}</div>;
};
export default Background;
