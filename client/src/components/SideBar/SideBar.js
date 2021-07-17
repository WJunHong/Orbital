// Imports
import React, { useState, useEffect } from "react";
import app from "../../base";

import EventNoteIcon from "@material-ui/icons/EventNote";
import ExploreIcon from "@material-ui/icons/Explore";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import styles from "./SideBar.module.css";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ViewListRoundedIcon from "@material-ui/icons/ViewListRounded";
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * A functional component representing a side bar
 * @returns JSX of a sidebar component
 */
function SideBar({ match }) {
  const [allLists, setAllLists] = useState([]);
  const highlight = () => {
    if (match.path === "/") {
      document.querySelector(".overviewPage").style.backgroundColor = "#121e4f";
      document.querySelector(".overviewPage").style.color = "white";
    } else if (match.path === "/taskpage") {
      document.querySelector(".taskPage").style.backgroundColor = "#121e4f";
      document.querySelector(".taskPage").style.color = "white";
    } else {
    }
  };

  const resetEverything = () => {
    toggleAddList();
    document.querySelector("#addList123").textContent = "";
    document
      .querySelector("#addList123")
      .setAttribute("data-placeholder", "Untitled List");
  };

  const toggleAddList = () => {
    document.querySelector("#addList1").classList.toggle("hidden");

    document
      .querySelector("#addList123")
      .setAttribute("data-placeholder", "Untitled List");
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
  const getLists = async () => {
    try {
      const user = app.auth().currentUser;
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
      console.log(err);
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
          <a href="/calendar">
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
              <li className={styles.mainTask}>
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
