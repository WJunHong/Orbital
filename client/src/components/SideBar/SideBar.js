// Imports
import React, { Fragment } from "react";

import EventNoteIcon from "@material-ui/icons/EventNote";
import ExploreIcon from "@material-ui/icons/Explore";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import styles from "./SideBar.module.css";
import AddBoxIcon from "@material-ui/icons/AddBox";

/**
 * A functional component representing a side bar
 * @returns JSX of a sidebar component
 */
function SideBar() {
  return (
    <div className={styles.sideBar}>
      <ul>
        <li className={styles.overview}>
          <a href="/">
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
          <a href="/taskpage">
            <AllInboxIcon className={styles.maintaskIcon} />
            <div>Main Task</div>
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
