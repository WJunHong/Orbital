// Imports
import React, { useState, useEffect } from "react";
import app from "../../base";

import {
  EventNoteIcon,
  ExploreIcon,
  AllInboxIcon,
  AddBoxIcon,
  ViewListRoundedIcon,
  Button,
} from "../../design/table_icons";

import styles from "./SideBar.module.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * A functional component representing a side bar
 * @returns JSX of a sidebar component
 */
function SideBar({ match, testUser }) {
  const [allLists, setAllLists] = useState([]);
  const highlight = () => {
    if (match.path === "/") {
      document.querySelector(".overviewPage").style.backgroundColor = "#121e4f";
      document.querySelector(".overviewPage").style.color = "white";
    } else if (match.path === "/taskpage") {
      document.querySelector(".taskPage").style.backgroundColor = "#121e4f";
      document.querySelector(".taskPage").style.color = "white";
    } else if (match.path === "/calendar") {
      document.querySelector(".calendarPage").style.backgroundColor = "#121e4f";
      document.querySelector(".calendarPage").style.color = "white";
    }
  };
  /**
   * Function 1: Resets the list placeholder and input field and styling.
   */
  const resetEverything = () => {
    toggleAddList();
    document.querySelector("#addList123").textContent = "";
    document
      .querySelector("#addList123")
      .setAttribute("data-placeholder", "Untitled List");
  };

  /**
   * Function 2: Hides add list content. Does not reset the input fields.
   */
  const toggleAddList = () => {
    document.querySelector("#addList1").classList.toggle("hidden");

    document
      .querySelector("#addList123")
      .setAttribute("data-placeholder", "Untitled List");
  };
  /**
   * Function 3: Adds a new list to the database.
   * @param {Object} e The form submission event object.
   */
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
        toast.warn(`Please type something!`, {
          position: "top-right",
          autoClose: 1700,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      } else if (allLists.includes(listName)) {
        document.querySelector("#addList123").textContent = "";
        document
          .querySelector("#addList123")
          .setAttribute("data-placeholder", "List already exists!");
        toast.warn(`List already exists!`, {
          position: "top-right",
          autoClose: 1700,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      } else {
        // Fetches user_id
        const user = testUser || app.auth().currentUser;
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
        toast.success(`List ${listName} added!`, {
          position: "top-right",
          autoClose: 1700,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  /**
   * Function 4: Gets all lists related to the current user.
   */
  const getLists = async () => {
    try {
      const user = testUser || app.auth().currentUser;
      const user_id = user.uid;
      const response = await fetch("/todos/lists", {
        method: "GET",
        headers: { user_id },
      });

      const jsonData = await response.json();
      if (jsonData !== null) {
        setAllLists(jsonData);
        const {
          params: { listName },
        } = match;
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => highlight(), []);

  useEffect(() => {
    getLists();
  }, [allLists]);

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
          <a href="/calendar" className="calendarPage">
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
        <ul className={styles.listTabs}>
          {allLists.map((list) => {
            var link = "/lists/" + list;

            return (
              <li className={styles.mainTask} data-testid={list}>
                <a href={link} className={`SL${list}`}>
                  <ViewListRoundedIcon className={styles.maintaskIcon} />
                  <div>{list}</div>
                </a>
              </li>
            );
          })}
        </ul>
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
            input="true"
            type="text"
            className={styles.addListName}
            contentEditable
            data-placeholder="Untitled List"
            onFocus={() =>
              document
                .querySelector("#addList123")
                .setAttribute("data-placeholder", "Untitled List")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
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
      <ToastContainer />
    </div>
  );
}

export default SideBar;
