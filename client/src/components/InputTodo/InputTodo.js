// Imports
import React, { Fragment, useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import styles from "./InputTodo.module.css";
import OutlinedFlagRoundedIcon from "@material-ui/icons/OutlinedFlagRounded";
import LabelImportantRoundedIcon from "@material-ui/icons/LabelImportantRounded";
import { AlarmIcon, CalendarTodayRoundedIcon } from "../../design/table_icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import app from "../../base";

/**
 * A functional component representing the input of a task
 * @returns JSX of input field and add button
 */
const InputToDo = () => {
  // Description of a task
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [priority, setPriority] = useState(5);
  const [todoDate, setTodoDate] = useState(null);

  const onSubmitForm = async (e) => {
    // Prevents page from reloading on form submission
    e.preventDefault();
    try {
      if (description === "") {
        // If task field is empty, do not submit anything
      } else {
        // Fetches user_id
        const user = app.auth().currentUser;
        const user_id = user.uid;

        // Sends a request to create the new task in server
        const body = { user_id, description };
        const response = await fetch("/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        // Reset the input field to empty upon successful task submission
        document.querySelector(".add_task").value = "";
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const focusText = (e) => {
    e.preventDefault();
    if (e.target.className == styles.typableArea) {
      document.querySelector("#something1").focus();
    }
  };
  const openCalendar = () =>
    document
      .querySelector(`.${styles.deadlineIcon}`)
      .addEventListener("focus", (e) =>
        document.querySelector(`.${styles.deadlineText}`).focus()
      );

  const deadlineColors = () => {
    if (startDate == null) {
      document.querySelector(`.${styles.deadlineIcon}`).style.color = "white";
      document.querySelector(`.${styles.deadlineText}`).style.color = "white";
      document.querySelector(`.${styles.deadlineText}`).style.borderColor =
        "white";
    } else {
      if (new Date().setHours(0, 0, 0, 0) == startDate.setHours(0, 0, 0, 0)) {
        document.querySelector(`.${styles.deadlineIcon}`).style.color = "green";
        document.querySelector(`.${styles.deadlineText}`).style.color = "green";
        document.querySelector(`.${styles.deadlineText}`).style.borderColor =
          "green";
      } else {
        document.querySelector(`.${styles.deadlineIcon}`).style.color = "white";
        document.querySelector(`.${styles.deadlineText}`).style.color = "white";
        document.querySelector(`.${styles.deadlineText}`).style.borderColor =
          "white";
      }
    }
  };
  const toggleAdd = () => {
    document
      .querySelector(`.${styles.addTaskButton}`)
      .classList.toggle("hidden");
    document.querySelector(`.${styles.addTaskBox}`).classList.toggle("hidden");
  };
  const togglePriority = () => {
    document
      .querySelector(`.${styles.priorityOptions}`)
      .classList.toggle("hidden");
  };
  const makePriority = (e, val) => {
    togglePriority();
    switch (val) {
      case 1:
        // code block
        document.querySelector(`.${styles.sideButton1}`).style.color = "red";
        setPriority(1);
        break;
      case 2:
        // code block
        document.querySelector(`.${styles.sideButton1}`).style.color =
          "rgb(218, 109, 7)";
        setPriority(2);
        break;
      case 3:
        // code block
        document.querySelector(`.${styles.sideButton1}`).style.color =
          "rgb(255, 217, 0)";
        setPriority(3);
        break;
      case 4:
        // code block
        document.querySelector(`.${styles.sideButton1}`).style.color =
          "rgb(27, 228, 1)";
        setPriority(4);
        break;
      default:
        // code block
        document.querySelector(`.${styles.sideButton1}`).style.color = "white";
        setPriority(5);
    }
  };

  const makeTodoDate = () => {
    if (todoDate == null) {
      document.querySelector(`.alarmIcon`).style.color = "white";
    } else {
      if (new Date().setHours(0, 0, 0, 0) == todoDate.setHours(0, 0, 0, 0)) {
        document.querySelector(`.alarmIcon`).style.color = "green";
      } else {
        document.querySelector(`.alarmIcon`).style.color = "white";
      }
    }
  };
  useEffect(() => {
    deadlineColors();
  }, [startDate]);
  useEffect(() => {
    makeTodoDate();
  }, [todoDate]);
  return (
    <Fragment>
      <div className={styles.addTask}>
        <Fab
          aria-label="add"
          className={styles.addTaskButton}
          size="small"
          onClick={(e) => toggleAdd(e)}
        >
          <AddIcon className={styles.addButtonPlus} />
        </Fab>
        <form
          className={`${styles.addTaskBox} hidden`}
          onClick={(e) => focusText(e)}
        >
          <div className={styles.textDeadlineLabel}>
            <div
              id="something1"
              contentEditable
              className={`${styles.addTaskText} ${styles.typableArea}`}
              data-placeholder="e.g. Watch 2040s recording"
            ></div>
            <div className={`${styles.typableArea}`}>
              <label className={styles.deadlineBox}>
                <CalendarTodayRoundedIcon
                  className={styles.deadlineIcon}
                  onClick={openCalendar}
                />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="yyyy-MM-dd hh:mm aa"
                  placeholderText="Input Deadline"
                  minDate={new Date()}
                  className={`${styles.deadlineText}`}
                />
              </label>
            </div>
            <div className={styles.typableArea}>
              <div className={styles.labelBox}>
                <LabelImportantRoundedIcon />
                <div>Add Property +</div>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.sideButton}>
              <div className={styles.sideButton1} onClick={togglePriority}>
                <OutlinedFlagRoundedIcon />
              </div>
              <div className={`${styles.priorityOptions} hidden`}>
                <ul>
                  <li onClick={(e) => makePriority(e, 1)}>
                    <OutlinedFlagRoundedIcon className={styles.po1} />
                    Priority 1
                  </li>
                  <li onClick={(e) => makePriority(e, 2)}>
                    <OutlinedFlagRoundedIcon className={styles.po2} />
                    Priority 2
                  </li>
                  <li onClick={(e) => makePriority(e, 3)}>
                    <OutlinedFlagRoundedIcon className={styles.po3} />
                    Priority 3
                  </li>
                  <li onClick={(e) => makePriority(e, 4)}>
                    <OutlinedFlagRoundedIcon className={styles.po4} />
                    Priority 4
                  </li>
                  <li onClick={(e) => makePriority(e, 5)}>
                    <OutlinedFlagRoundedIcon className={styles.po5} />
                    Priority 5
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.sideButton}>
              <DatePicker
                selected={todoDate}
                onChange={(date) => setTodoDate(date)}
                customInput={
                  <div className={styles.sideButton2}>
                    <AlarmIcon className="alarmIcon" />
                  </div>
                }
                maxDate={startDate}
                minDate={new Date()}
              />
            </div>
          </div>
        </form>
        {/* Old stuff*/}
        <form
          className={`${styles.addTaskMenu} d-flex`}
          onSubmit={onSubmitForm}
        >
          <input
            type="text"
            className="form-control add_task"
            placeholder="Input task"
            onChange={(e) => makeTodoDate(e)}
            autoComplete="off"
          />

          <button className="btn btn-success add_button"> Add</button>
        </form>
      </div>
    </Fragment>
  );
};

export default InputToDo;
