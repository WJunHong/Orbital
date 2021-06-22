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
  var filterObj;
  if (localStorage.getItem(`filter-${name}`) == null) {
    filterObj = {
      priority: [],
      deadline: [null, null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: [],
    };
  } else {
    filterObj = JSON.parse(localStorage.getItem(`filter-${name}`));
  }


  const initialPriorities = [1, 2, 3, 4, 5];
  // Properties from the user
  const [properties, setProperties] = useState([]);
  // Things which have been selected
  const [priority, setPriority] = useState(filterObj.priority);
  const [progress, setProgress] = useState(filterObj.progress);
  const [deadlineStart, setDS] = useState(filterObj.deadline[0]);
  const [deadlineEnd, setDE] = useState(filterObj.deadline[1]);
  const [todoStart, setTS] = useState(filterObj.todoDate[0]);
  const [todoEnd, setTE] = useState(filterObj.todoDate[1]);
  const [clickedF, setClickF] = useState(false);
  const [clickedS, setClickS] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState(filterObj.properties);

  const handleClick = (e, num) => {
    if (e.target.style.backgroundColor != "black") {
      e.target.style.backgroundColor = "black";
    } else {
      e.target.style.backgroundColor = "#414141";
    }
  };
  const clearAllPriority = () => {
    document
      .querySelectorAll(`.${styles.priorityButton}`)
      .forEach((i) => (i.style.backgroundColor = "#414141"));
    setPriority([]);
    var newFilterObj = {
      ...filterObj,
      priority: [],
    };
    localStorage.setItem(`filter-${name}`, JSON.stringify(newFilterObj));
  };
  const handleChange = (event, newValue) => {
    handleSelect("progress", newValue, progress, setProgress);
  };

  const clearAllProgress = () => {
    setProgress([0, 100]);
    var newFilterObj = {
      ...filterObj,
      progress: [0, 100],
    };
    localStorage.setItem(`filter-${name}`, JSON.stringify(newFilterObj));
  };

  const clearDeadlines = () => {
    setDS(null);
    setDE(null);
    var newFilterObj = {
      ...filterObj,
      deadline: [null, null],
    };
    localStorage.setItem(`filter-${name}`, JSON.stringify(newFilterObj));
  };

  const clearTodoDate = () => {
    setTE(null);
    setTS(null);
    var newFilterObj = {
      ...filterObj,
      todoDate: [null, null],
    };
    localStorage.setItem(`filter-${name}`, JSON.stringify(newFilterObj));
  };

  const clearAllProperties = () => {
    setSelectedProperties([]);
    var newFilterObj = {
      ...filterObj,
      properties: [],
    };
    localStorage.setItem(`filter-${name}`, JSON.stringify(newFilterObj));
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
    var filter;
    switch (str) {
      case "priority":
        filter = {
          ...filterObj,
          priority: newSelection,
        };
        break;
      case "deadline":
        set(property);
        filter = {
          ...filterObj,
          deadline: arr,
        };
        break;
      case "progress":
        filter = {
          ...filterObj,
          progress: newSelection,
        };
        break;

      case "todoDate":
        set(property);
        filter = {
          ...filterObj,
          todoDate: arr,
        };
        break;
      case "property":
        filter = {
          ...filterObj,
          properties: newSelection,
        };
    }
    localStorage.setItem(`filter-${name}`, JSON.stringify(filter));
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
              <li className={styles.clearPriority} onClick={clearAllPriority}>
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
                onClick={clearAllProgress}
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
                    deadlineEnd == null ? null : new Date(deadlineEnd)
                  }
                  onChange={(date) =>
                    handleSelect("deadline", date, [deadlineStart, date], setDE)
                  }
                  placeholderText="End"
                  className={styles.deadlineInput}
                  minDate={
                    deadlineStart == null ? undefined : new Date(deadlineStart)
                  }
                />
                <ClearIcon
                  className={styles.clearDeadlines}
                  onClick={clearDeadlines}
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
                  selected={
                    todoStart == null ? null : new Date(todoStart)
                  }
                  onChange={(date) =>
                    handleSelect("todoDate", date, [date, todoEnd], setTS)
                  }
                  placeholderText="Start"
                  className={styles.deadlineInput}
                  maxDate={
                    todoEnd == null ? undefined : new Date(todoEnd)
                  }
                />
                <DatePicker
                  selected={
                    todoEnd == null ? null : new Date(todoEnd)
                  }
                  onChange={(date) =>
                    handleSelect("todoDate", date, [todoStart, date], setTE)
                  }
                  placeholderText="End"
                  className={styles.deadlineInput}
                  minDate={
                    todoStart == null ? undefined : new Date(todoStart)
                  }
                />
                <ClearIcon
                  className={styles.clearDeadlines}
                  onClick={clearTodoDate}
                />
              </div>
            </div>
          </div>
          <div>
            <div className={styles.Tag}>
              Properties
              <div className={styles.priorityButtons}>
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
                <ClearIcon className={styles.clearDeadlines} onClick={clearAllProperties} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.sortOptions}>Something big</div>
      </div>
    </div>
  );
};

export default FSD;
