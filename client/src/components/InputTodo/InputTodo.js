// Imports
import React, { Fragment, useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import styles from "./InputTodo.module.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import app from "../../base";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Tooltip,
  OutlinedFlagRoundedIcon,
  LabelImportantRoundedIcon,
  Chip,
  CloseIcon,
  Button,
  AlarmIcon,
  CalendarTodayRoundedIcon,
  Box,
} from "../../design/table_icons";

/**
 * A functional component representing the input of a task
 * @returns JSX of input field and add button
 */
const InputToDo = ({ listName, handleSubmit }) => {
  // Description of a task
  const [deadline, setDeadline] = useState(null);
  const [priority, setPriority] = useState(5);
  const [tododate, setTodoDate] = useState(null);
  const [todoEndDate, setTodoEndDate] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyLabels, setPL] = useState([]);
  /**
   * Functon 1: Resets the inputs in the task input.
   */
  const resetEverything = () => {
    toggleAdd();
    setDeadline(null);
    setPriority(5);
    setTodoDate(null);
    setTodoEndDate(null);
    setProperties([]);
    setPL([]);
    document.getElementById("something1").textContent = "";
    document.querySelector(`.${styles.sideButton1}`).style.color = "white";
    document.querySelector(`.alarmIcon`).style.color = "white";
    document.querySelector(`.${styles.addPropertyField}`).value = "";
    document
      .getElementById("something1")
      .setAttribute("data-placeholder", "e.g. Watch 2040s recording");
    document
      .querySelector(`.${styles.priorityOptions}`)
      .classList.add("hidden");
  };
  /**
   * Function 2: The function that is called when the new task is submitted. Sends data to database and calls resetEverything().
   * @param {Object} e The event of submitting a form.
   */
  const onSubmitForm = async (e) => {
    // Prevents page from reloading on form submission
    e.preventDefault();
    const description = document.getElementById("something1").textContent;
    var x = document.getElementById("endTimeOption");
    var todoenddate = todoEndDate;
    if (x.style.visibility === "hidden") {
      todoenddate = null;
    }
    try {
      if (description === "") {
        // If task field is empty, do not submit anything
        document
          .getElementById("something1")
          .setAttribute("data-placeholder", "Please type something!!");
        toast.error("Please type something!", {
          position: "top-right",
          autoClose: 3000,
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
          description,
          deadline,
          tododate,
          todoenddate,
          priority,
          properties,
          listName,
        };
        await fetch("/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        // Reset the input field to empty upon successful task submission
        resetEverything();
        toast.success("Task Added!", {
          position: "top-right",
          autoClose: 3000,
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
   * Function 3: By clicking an empty space within the input box, focuses the mouse on the editable div.
   * @param {Object} e The event of clicking.
   */
  const focusText = (e) => {
    e.preventDefault();
    if (e.target.classList.contains(styles.typableArea)) {
      document.querySelector("#something1").focus();
      document
        .getElementById("something1")
        .setAttribute("data-placeholder", "e.g. Watch 2040s recording");
    }
  };
  /**
   * Function 4: Opens the deadline selector when clicking on the calendar icon.
   *
   */
  const openCalendar = () => {
    document
      .querySelector(`.${styles.deadlineIcon}`)
      .addEventListener("focus", (e) =>
        document.querySelector(`.${styles.deadlineText}`).focus()
      );
  };
  /**
   * Function 5: Manipulates the deadline color when TODAY's data is selected.
   */
  const deadlineColors = () => {
    if (deadline == null) {
      document.querySelector(`.${styles.deadlineIcon}`).style.color = "white";
      document.querySelector(`.${styles.deadlineText}`).style.color = "white";
      document.querySelector(`.${styles.deadlineText}`).style.borderColor =
        "white";
    } else {
      // If tododate is now after the deadline, set the tododate to null
      if (tododate == null) {
      } else if (
        deadline.getFullYear() <= tododate.getFullYear() &&
        deadline.getMonth() <= tododate.getMonth() &&
        deadline.getDate() <= tododate.getDate()
      ) {
        setTodoDate(null);
        setTodoEndDate(null);
        document.querySelector(`.${styles.alarmIcon}`).style.color = "white";
        document.querySelector(`.${styles.todoText}`).style.color = "white";
        document.querySelector(`.${styles.todoTime}`).style.color = "white";
      }
      const testDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate(),
      };
      if (
        deadline.getFullYear() === testDate["year"] &&
        deadline.getMonth() === testDate["month"] &&
        deadline.getDate() === testDate["day"]
      ) {
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
  /**
   * Function 6: Toggles the display of the add button and the add task input field.
   */
  const toggleAdd = () => {
    document
      .querySelector(`.${styles.addTaskButton}`)
      .classList.toggle("hidden");
    document.querySelector(`.${styles.addALL}`).classList.toggle("hidden");
  };
  /**
   * Function 7: Toggles the dropdown of the priority options.
   */
  const togglePriority = () => {
    document
      .querySelector(`.${styles.priorityOptions}`)
      .classList.toggle("hidden");
  };
  /**
   * Function 8: Sets the current value of priority when the user selects the dropdown option.
   * @param {Object} e The event of clicking.
   * @param {int} val The value of priority selected.
   */
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
    toast.success("Priority added!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };
  /**
   * Function 9: Checks the tododate selected. Changes the style if selected day is TODAY. Also checks if the end date is LATER than the start date if value is given.
   */
  const makeTodoDate = () => {
    if (tododate != null) {
      const today = new Date();
      if (
        today.getFullYear() === tododate.getFullYear() &&
        today.getMonth() === tododate.getMonth() &&
        today.getDate() === tododate.getDate()
      ) {
        document.querySelector(`.alarmIcon`).style.color = "green";
        document.querySelector(`.${styles.todoText}`).style.color = "green";
        if (todoEndDate == null) {
          toast.success("Todo Date added!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        }
      } else {
        document.querySelector(`.alarmIcon`).style.color = "white";
        document.querySelector(`.${styles.todoText}`).style.color = "white";
      }
    }

    if (todoEndDate != null) {
      const today = new Date();
      if (
        today.getFullYear() === todoEndDate.getFullYear() &&
        today.getMonth() === todoEndDate.getMonth() &&
        today.getDate() === todoEndDate.getDate()
      ) {
        document.querySelector(`.alarmIcon`).style.color = "green";
        document.querySelector(`.${styles.todoTime}`).style.color = "green";
      } else {
        document.querySelector(`.alarmIcon`).style.color = "white";
        document.querySelector(`.${styles.todoTime}`).style.color = "white";
      }
    }

    if (tododate != null && todoEndDate != null) {
      if (tododate.getTime() > todoEndDate.getTime()) {
        setTodoEndDate(null);
        toast.dark("Todo End Date needs to be later than Todo Start Date!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      } else {
        toast.success("Todo Date added!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    }
  };
  /**
   * Function 10: Adds a property to the task. If the property already exists, prevents the user from re-entering it. Also prevents the user from entering an empty property name.
   * @param {Object} e The event object linked to the input field.
   */
  const addProperty = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (properties.includes(e.target.value)) {
        toast.warning("Property already exists!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      } else if (e.target.value === "") {
        toast.warning("Type a property!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      } else {
        setPL([
          ...propertyLabels,
          { key: properties.length, label: e.target.value },
        ]);
        setProperties([...properties, e.target.value]);
        toast.success("Property added!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
      e.target.value = "";
    }
  };
  /**
   * Fucntion 11: Handles the deletion of a property from the task to be added.
   * @param {Object} chipToDelete The chip object to be deleted.
   * @returns A lambda that is called when the delete button is pressed.
   */
  const handleDelete = (chipToDelete) => () => {
    setPL(propertyLabels.filter((chip) => chip.key !== chipToDelete.key));
    setProperties(properties.filter((chip) => chip !== chipToDelete.label));
  };
  useEffect(() => {
    deadlineColors();
  }, [deadline]);
  return (
    <Fragment>
      <div className={styles.addTask}>
        <div className={styles.addTaskBegin}>
          <Fab
            aria-label="add"
            className={styles.addTaskButton}
            size="small"
            onClick={(e) => toggleAdd(e)}
            data-testid="expand-InputTodo-button"
            id="testAddButton"
          >
            <AddIcon className={styles.addButtonPlus} />
          </Fab>
          Add Task
        </div>
        <form
          onSubmit={
            handleSubmit == null ? (e) => onSubmitForm(e) : handleSubmit
          }
          className={`${styles.addALL} hidden`}
          id="lmao"
          data-testid="InputTodo-form"
        >
          <div className={`${styles.addTaskBox}`} onClick={(e) => focusText(e)}>
            <div className={styles.textDeadlineLabel}>
              <div
                id="something1"
                contentEditable
                className={`${styles.addTaskText} ${styles.typableArea}`}
                data-placeholder="e.g. Watch 2040s recording"
              ></div>
              <div className={`${styles.typableArea}`}>
                <label className={styles.deadlineBox}>
                  <AlarmIcon
                    className={`${styles.alarmIcon} alarmIcon`}
                    onClick={() => {
                      document
                        .querySelector(`#endTimeOption`)
                        .classList.toggle("hidden");
                      setTodoEndDate(null);
                    }}
                  />
                  <DatePicker
                    selected={tododate}
                    onChange={(date) => {
                      setTodoDate(date);
                    }}
                    onCalendarClose={makeTodoDate}
                    showTimeSelect
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="dd-MM-yyyy hh:mm aa"
                    placeholderText="Input Tododate"
                    minDate={new Date()}
                    maxDate={deadline == null ? null : deadline}
                    className={`${styles.todoText}`}
                  />
                  <div className={`hidden`} id="endTimeOption">
                    <Box className={styles.dashBox}> - </Box>
                    <DatePicker
                      selected={todoEndDate}
                      onChange={(date) => {
                        setTodoEndDate(date);
                      }}
                      onCalendarOpen={() => {
                        if (todoEndDate == null) setTodoEndDate(tododate);
                      }}
                      onCalendarClose={makeTodoDate}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      placeholderText="Input Endtime"
                      minDate={tododate}
                      maxDate={tododate}
                      filterTime={(time) =>
                        tododate === null ? true : time >= tododate.getTime()
                      }
                      className={`${styles.todoTime}`}
                    />
                  </div>
                </label>
                <p className={`${styles.setEndTimeText}`}>
                  Click on the Clock Icon to include Endtime
                </p>
              </div>
              <div className={`${styles.typableArea}`}>
                <label className={styles.deadlineBox}>
                  <CalendarTodayRoundedIcon
                    className={styles.deadlineIcon}
                    onClick={openCalendar}
                  />
                  <DatePicker
                    selected={deadline}
                    onChange={(date) => {
                      setDeadline(date);
                    }}
                    showTimeSelect
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="dd-MM-yyyy hh:mm aa"
                    placeholderText="Input Deadline"
                    minDate={new Date()}
                    className={`${styles.deadlineText}`}
                    onCalendarClose={() => {
                      if (deadline !== null)
                        toast.success("Deadline added!", {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: false,
                          progress: undefined,
                        });
                    }}
                  />
                </label>
              </div>
              <div className={`${styles.typableArea} ${styles.propertyBox}`}>
                <div className={styles.labelBox}>
                  <LabelImportantRoundedIcon />
                  <input
                    onKeyPress={(e) => addProperty(e)}
                    placeholder="Add Property +"
                    className={styles.addPropertyField}
                    type="text"
                  />
                  {propertyLabels.map((data) => (
                    <Chip
                      label={data.label}
                      onDelete={handleDelete(data)}
                      key={data.key}
                      data-testid={data.label}
                      size="small"
                      className={styles.propertyChip}
                      variant="outlined"
                      deleteIcon={
                        <CloseIcon
                          className={styles.close}
                          data-testid={`${data.label}_close`}
                        />
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className={styles.sideButton}>
                <div className={styles.sideButton1} onClick={togglePriority}>
                  <Tooltip title="Select Priority" placement="top-start">
                    <OutlinedFlagRoundedIcon />
                  </Tooltip>
                </div>
                <div className={`${styles.priorityOptions} hidden`}>
                  <ul>
                    <li onClick={(e) => makePriority(e, 1)} data-testid="test1">
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
            </div>
          </div>
          <Button
            variant="contained"
            type="submit"
            form="lmao"
            className={styles.confirmButton}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={resetEverything}
            className={styles.cancelButton}
          >
            <CloseIcon size="small" />
            Cancel
          </Button>
        </form>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default InputToDo;
