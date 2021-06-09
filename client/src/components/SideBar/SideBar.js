// Imports
import React, { Fragment } from "react";

import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import EventNoteIcon from "@material-ui/icons/EventNote";
import ExploreIcon from "@material-ui/icons/Explore";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import styles from "./SideBar.module.css";
import AddBoxIcon from "@material-ui/icons/AddBox";

/**
 * A functional component representing a side bar
 * @returns JSX of a sidebar component
 */
{
  /*<div className={`${styles.sideBar} side_bar`}>
      <Navigation
        // Path to be added
        // activeItemId="/management/members"
        onSelect={({ itemId }) => {
          // maybe push to the route
        }}
        items={[
          {
            title: "Overview",
            itemId: "/overview",
            // elemBefore: () => <Icon name="inbox" />,
          },
          {
            title: "Calendar",
            itemId: "/calendar",
            // elemBefore: () => <Icon name="inbox" />,
          },
          {
            title: "Lists",
            itemId: "/lists",
            // elemBefore: () => <Icon name="users" />,
            subNav: [
              {
                title: "Main Tasks",
                itemId: "/lists/maintasks",
              },
              {
                title: "GER1000",
                itemId: "/lists/ger1000",
              },
            ],
          },
        ]}
      />
      </div>*/
}

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
