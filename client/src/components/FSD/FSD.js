import React, { useState, useEffect, Fragment } from "react";
import app from "../../base";
// Styles
import Fab from "@material-ui/core/Fab";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import SortRoundedIcon from "@material-ui/icons/SortRounded";
import styles from "./FSD.module.css";
import ClearIcon from "@material-ui/icons/Clear";
import Slider from "@material-ui/core/Slider";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const muiTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: "#662d91",
      },
      track: {
        color: "white",
      },
      rail: {
        color: "#333333",
      },
    },
  },
});

/* FSD contains:
1. Filter button
2. Sort Button
3. Delete Button (not applicable to main task)

Filter pop-up
Sort pop up
*/
const FSD = ({ name, todos }) => {
  const filterObj = localStorage.getItem(`filter-${name}`);

  const initialSelectedProperties =
    filterObj == null ? [] : JSON.parse(filterObj).properties; // user properties to be fetched from database
  const initialSelectedPriorities =
    filterObj == null ? [] : JSON.parse(filterObj).priority;
  const initialSelectedDeadline =
    filterObj == null ? [null, null] : JSON.parse(filterObj).deadline;
  const initialSelectedProgress =
    filterObj == null ? [0, 100] : JSON.parse(filterObj).progress;
  const initialSelectedToDoDate =
    filterObj == null ? [null, null] : JSON.parse(filterObj).todoDate;

  const initialPriorities = [1, 2, 3, 4, 5];
  // Properties from the user
  const [properties, setProperties] = useState([]);
  // Things which have been selected
  const [priority, setPriority] = useState(initialSelectedPriorities);
  const [progress, setProgress] = useState(initialSelectedProgress);
  const [deadlineStart, setDS] = useState(initialSelectedDeadline[0]);
  const [deadlineEnd, setDE] = useState(initialSelectedDeadline[1]);
  const [todoStart, setTS] = useState(new Date(initialSelectedToDoDate[0]));
  const [todoEnd, setTE] = useState(new Date(initialSelectedToDoDate[1]));
  const [clickedF, setClickF] = useState(false);
  const [clickedS, setClickS] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState(
    initialSelectedProperties
  );

  const handleClick = (e, num) => {
    if (e.target.style.backgroundColor != "black") {
      e.target.style.backgroundColor = "black";
    } else {
      e.target.style.backgroundColor = "#414141";
    }
  };
  const deleteAllPriority = () => {
    document
      .querySelectorAll(`.${styles.priorityButton}`)
      .forEach((i) => (i.style.backgroundColor = "#414141"));
    setPriority([]);
  };
  const handleChange = (event, newValue) => {
    //setProgress(newValue);
    handleSelect("progress", newValue, progress, setProgress);
  };

  const deleteAllProgress = () => {
    setProgress([0, 99]);
  };

  const deleteDeadlines = () => {
    setDS(null);
    setDE(null);
  };

  const deleteTodos = () => {
    setTE(null);
    setTS(null);
  };

  const toggleFilterOptions = () => {
    document
      .querySelector(`.${styles.filterOptions}`)
      .classList.toggle(`hidden`);
    setClickF(!clickedF);
  };
  const toggleSortOptions = () => {
    setClickS(!clickedS);
  };

  const handleSelect = (str, property, arr, set) => {
    var newSelection = null;
    if (str == "priority" || str == "property") {
      // If there is already a selection for the item
      const isSelected = arr.includes(property);
      if (isSelected) {
        newSelection = arr.filter((currProperty) => currProperty != property);
      } else {
        newSelection = [...arr, property];
      }
      set(newSelection);
    } else if (str == "progress") {
      newSelection = property;
      set(newSelection);
    }
    var filterObj;
    switch (str) {
      case "priority":
        filterObj = {
          priority: newSelection,
          deadline: initialSelectedDeadline,
          progress: progress,
          todoDate: initialSelectedToDoDate,
          properties: selectedProperties,
        };
        break;
      case "deadline":
        set(property);
        filterObj = {
          priority: priority,
          deadline: arr,
          progress: progress,
          todoDate: initialSelectedToDoDate,
          properties: selectedProperties,
        };
        break;
      case "progress":
        filterObj = {
          priority: priority,
          deadline: initialSelectedDeadline,
          progress: newSelection,
          todoDate: initialSelectedToDoDate,
          properties: selectedProperties,
        };
        break;

      case "todoDate":
        set(property);
        filterObj = {
          priority: priority,
          deadline: initialSelectedDeadline,
          progress: progress,
          todoDate: arr,
          properties: selectedProperties,
        };
        break;
      case "property":
        filterObj = {
          priority: priority,
          deadline: [null, null],
          progress: progress,
          todoDate: [null, null],
          properties: newSelection,
        };
    }
    localStorage.setItem(`filter-${name}`, JSON.stringify(filterObj));
  };

  const getProperties = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all properties route method
      const response = await fetch("/filter/properties", {
        method: "GET",
        headers: { user_id },
      });
      const jsonData = await response.json();
      const { unique_properties } = jsonData;
      if (unique_properties !== null) {
        setProperties(unique_properties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Called when rendered, adding or deleting a task
  useEffect(() => getProperties(), [todos]);

  //Testing
  return (
    <div className={styles.buttonZs}>
      <div className={styles.buttonDiv}>
        <Fab
          size="small"
          aria-label="filter"
          className={styles.filterButton}
          onClick={toggleFilterOptions}
        >
          {clickedF ? <ClearIcon /> : <FilterListRoundedIcon />}
        </Fab>
        <Fab
          size="small"
          aria-label="filter"
          className={styles.sortButton}
          onClick={toggleSortOptions}
        >
          {clickedS ? <ClearIcon /> : <SortRoundedIcon />}
        </Fab>
      </div>
      <div className={styles.sideHandler}>
        <div className={`${styles.filterOptions} hidden`}>
          <div className={styles.topText}>Filter Options:</div>
          <div>
            <div className={styles.Tag}>Priority</div>
            <ul className={styles.priorityButtons}>
              {initialPriorities.map((item) => {
                const selectedColour = priority.includes(item)
                  ? "black"
                  : "#414141";
                return (
                  <li
                    style={{ backgroundColor: `${selectedColour}` }}
                    className={styles.priorityButton}
                    onClick={(e) => {
                      handleClick(e, item);
                      handleSelect("priority", item, priority, setPriority);
                    }}
                  >
                    {item}
                  </li>
                );
              })}
              <li className={styles.clearPriority} onClick={deleteAllPriority}>
                <ClearIcon />
              </li>
            </ul>
          </div>
          <div>
            <div className={styles.Tag}>Progress</div>
            <div className={styles.progressWrap}>
              <ThemeProvider theme={muiTheme}>
                <Slider
                  value={progress}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  className={styles.progressSlider}
                  max={100}
                />
              </ThemeProvider>
              <ClearIcon
                className={styles.clearProgress}
                onClick={deleteAllProgress}
              />
            </div>
          </div>
          <div>
            <div className={styles.Tag}>
              Deadline
              <div className={styles.deadlineContainer}>
                <DatePicker
                  selected={
                    deadlineStart == null ? null : new Date(deadlineStart)
                  }
                  onChange={(date) =>
                    handleSelect("deadline", date, [date, deadlineEnd], setDS)
                  }
                  placeholderText="Start"
                  className={styles.deadlineInput}
                  maxDate={
                    deadlineEnd == null ? undefined : new Date(deadlineEnd)
                  }
                />
                <DatePicker
                  selected={
                    deadlineEnd == null ? null : new Date(deadlineStart)
                  }
                  onChange={(date) =>
                    handleSelect("deadline", date, [deadlineStart, date], setDE)
                  }
                  placeholderText="End"
                  className={styles.deadlineInput}
                  minDate={
                    deadlineStart == null ? undefined : new Date(deadlineEnd)
                  }
                />
                <ClearIcon
                  className={styles.clearDeadlines}
                  onClick={deleteDeadlines}
                />
              </div>
            </div>
          </div>
          <div>
            {" "}
            <div className={styles.Tag}>
              Todo Date
              <div className={styles.deadlineContainer}>
                <DatePicker
                  selected={todoStart}
                  onChange={(date) =>
                    handleSelect("todoDate", date, [date, todoEnd], setTS)
                  }
                  placeholderText="Start"
                  className={styles.deadlineInput}
                  maxDate={todoEnd}
                />
                <DatePicker
                  selected={todoEnd}
                  onChange={(date) =>
                    handleSelect("todoDate", date, [todoStart, date], setTE)
                  }
                  placeholderText="End"
                  className={styles.deadlineInput}
                  minDate={todoStart}
                />
                <ClearIcon
                  className={styles.clearDeadlines}
                  onClick={deleteTodos}
                />
              </div>
            </div>
          </div>
          <div>
            <div className={styles.Tag}>Properties</div>
            {properties.map((property, index) => {
              const isSelected = selectedProperties.includes(property);
              return (
                <Fragment>
                  <input
                    name={`property-${index}`}
                    key={index}
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      handleSelect(
                        "property",
                        property,
                        selectedProperties,
                        setSelectedProperties
                      )
                    }
                  ></input>
                  <label
                    htmlFor={`property-${index}`}
                    style={{ color: "white" }}
                  >
                    {property}
                  </label>
                </Fragment>
              );
            })}
          </div>
        </div>
        <div className={styles.sortOptions}>Something big</div>
      </div>
    </div>
  );
};

export default FSD;
