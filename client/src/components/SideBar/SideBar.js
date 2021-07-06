// Imports
import React, { Fragment, useState, useEffect } from "react";
import app from "../../base";

import EventNoteIcon from "@material-ui/icons/EventNote";
import ExploreIcon from "@material-ui/icons/Explore";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import styles from "./SideBar.module.css";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";

/**
 * A functional component representing a side bar
 * @returns JSX of a sidebar component
 */
function SideBar() {
  const arr = ["CS2100", "CS2040S", "CS2030S"];
  const [allLists, setAllLists] = useState([]);

  const resetEverything = () => {
    toggleAddList();
    document.querySelector("#addList123").textContent = "";
    document
      .querySelector("#addList123")
      .setAttribute("data-placeholder", "Untitled List");
  };

  const toggleAddList = () => {
    document.querySelector("#addList1").classList.toggle("hidden");
  };
  const addList = async (e) => {
    // Prevents page from reloading on form submission
    e.preventDefault();
    const listName = document.getElementById("addList123").textContent;
    try {
      if (listName === "") {
        // If task field is empty, do not submit anything
        document
          .querySelector("#addList123")
          .setAttribute("data-placeholder", "Please type something!");
      } else if (allLists.includes(listName)) {
        document.querySelector("#addList123").textContent = "";
        document
          .querySelector("#addList123")
          .setAttribute("data-placeholder", "List already exists!");
      } else {
        // Fetches user_id
        const user = app.auth().currentUser;
        const user_id = user.uid;

        // Sends a request to create the new task in server
        const body = {
          user_id,
          listName,
        };
        const response = await fetch("/todos/lists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const jsonData = await response;

        // Reset the input field to empty upon successful task submission
        resetEverything();
        getLists();
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const getLists = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      const response = await fetch("/todos/lists", {
        method: "GET",
        headers: { user_id },
      });

      const jsonData = await response.json();
      setAllLists(jsonData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getLists();
  }, [allLists]);

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
        {allLists.map((list) => {
          var link = "/lists/" + list;
          return (
            <li className={styles.mainTask}>
              <a href={link}>
                <AllInboxIcon className={styles.maintaskIcon} />
                <div>{list}</div>
              </a>
            </li>
          );
        })}
      </ul>
      <div className={styles.addListButton} onClick={(e) => toggleAddList(e)}>
        <AddBoxIcon />
        Add List
      </div>
      <div>
        <form
          onSubmit={(e) => addList(e)}
          className={`${styles.addList} hidden`}
          id="addList1"
        >
          <div
            id="addList123"
            input
            type="text"
            className={styles.addListName}
            contentEditable
            data-placeholder="Untitled List"
          ></div>
          <Button
            variant="contained"
            type="submit"
            form="addList1"
            className={styles.confirmButton}
            size="small"
          >
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SideBar;
