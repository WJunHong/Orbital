// Imports
import React, { useEffect } from "react";

import EventNoteIcon from "@material-ui/icons/EventNote";
import ExploreIcon from "@material-ui/icons/Explore";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import styles from "./SideBar.module.css";
import AddBoxIcon from "@material-ui/icons/AddBox";

/**
 * A functional component representing a side bar
 * @returns JSX of a sidebar component
 */
function SideBar({ name }) {
  function highlight() {
    if (name == "/") {
      document.querySelector(".overviewPage").style.backgroundColor = "#273469";
      document.querySelector(".overviewPage").style.color = "white";
    } else if (name == "/taskpage") {
      document.querySelector(".taskPage").style.backgroundColor = "#273469";
      document.querySelector(".taskPage").style.color = "white";
    }
  }
  useEffect(() => highlight(), []);
  return (
    <div className={styles.sideBar}>
      <ul>
        <li className={styles.overview}>
          <a href="/" className="overviewPage">
            <ExploreIcon className={styles.overviewIcon} />
            <div>Overview</div>
          </a>
        </li>
        <li className={styles.calendar}>
          <a href="/">
            <EventNoteIcon className={styles.calendarIcon} />
            <div>Calendar</div>
          </a>
        </li>
        <li className={styles.mainTask}>
          <a href="/taskpage" className="taskPage">
            <AllInboxIcon className={styles.maintaskIcon} />
            <div>Main Tasks</div>
          </a>
        </li>
      </ul>
      <div className={styles.addList}>
        <AddBoxIcon className={styles.addButton} />
        Add List
      </div>
    </div>
  );
}

export default SideBar;
