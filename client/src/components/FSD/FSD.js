import React, { useState, useEffect, Fragment } from "react";
// Firebase import
import app from "../../base";
// Style imports
import {
  Fab,
  FilterListRoundedIcon,
  SortRoundedIcon,
  HighlightOffRoundedIcon,
  ClearIcon,
  ArrowDownwardRoundedIcon,
  ArrowUpwardRoundedIcon,
  Slider,
  Checkbox,
  Tooltip,
} from "../../design/table_icons";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
// Datepicker import
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withStyles } from "@material-ui/core/styles";
// Confirm Dialog import
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import styles from "./FSD.module.css";
// MuiThemes
const muiTheme = createTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: "#0f1425",
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
const CustomColorCheckbox = withStyles({
  root: {
    color: "rgb(143, 143, 143)",
    "&$checked": {
      color: "#f2aa4cff",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

/**
 * Filter, sort, delete component
 * @param {Object} . The props that represent the current page, as well as the todos array
 * @returns Functional component of Filter, sort and delete button
 */
const FSD = ({ name, todos, listName }) => {
  // The storage name of the filter/sort object
  const storageName = name + "/" + (listName == null ? "" : listName);
  var filterObj;
  // If there is no filter object in LS, create a default version
  if (localStorage.getItem(`filter-${storageName}`) == null) {
    filterObj = {
      priority: [],
      deadline: [null, null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: [],
    };
    localStorage.setItem(`filter-${storageName}`, JSON.stringify(filterObj));
  } else {
    filterObj = JSON.parse(localStorage.getItem(`filter-${storageName}`));
  }
  // If there is no sort object in LS, create a default version
  var sortVariable =
    localStorage.getItem(`sort-${storageName}`) == null
      ? { sort: "dateAdded", direction: "descending" }
      : JSON.parse(localStorage.getItem(`sort-${storageName}`));

  // Array of priorities
  const initialPriorities = [1, 2, 3, 4, 5];
  // Array of sort options
  const initialSort = ["Alphabetical", "Priority", "Progress", "Deadline"];
  // Properties from the user
  const [properties, setProperties] = useState([]);
  // Options which have been selected
  // Priority
  const [priority, setPriority] = useState(filterObj.priority);
  //Progress
  const [progress, setProgress] = useState(filterObj.progress);
  //Deadline start + end
  const [deadlineStart, setDS] = useState(filterObj.deadline[0]);
  const [deadlineEnd, setDE] = useState(filterObj.deadline[1]);
  // Todo date start + end
  const [todoStart, setTS] = useState(filterObj.todoDate[0]);
  const [todoEnd, setTE] = useState(filterObj.todoDate[1]);
  // Whether filter and sort button have been clicked
  const [clickedF, setClickF] = useState(false);
  const [clickedS, setClickS] = useState(false);
  // Direction of sort
  const [direction, setDirection] = useState(sortVariable.direction);
  // What is selected for sorting
  const [sortSelection, setSS] = useState(sortVariable.sort);
  // Properties selected
  const [selectedProperties, setSelectedProperties] = useState(
    filterObj.properties
  );
  // State of delete list modal
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  /**
   * Function 1: Handles the style of click event on priority numbers
   * @param {Object} e The event of clicking
   * @param {int} num The number pertaining to the click
   */
  const handleClick = (e, num) => {
    if (e.target.style.backgroundColor !== "black") {
      e.target.style.backgroundColor = "black";
    } else {
      e.target.style.backgroundColor = "#414141";
    }
  };

  /**
   * Function 2: Resets color of priorities and clears filtered priorities
   */
  const clearAllPriority = () => {
    document
      .querySelectorAll(`.${styles.priorityButton}`)
      .forEach((i) => (i.style.backgroundColor = "#414141"));
    setPriority([]);
    var newFilterObj = {
      ...filterObj,
      priority: [],
    };
    localStorage.setItem(`filter-${storageName}`, JSON.stringify(newFilterObj));
  };

  /**
   * Function 3: Takes in array of start and end progress filters and passes it to handleSelect function
   * @param {Object} event
   * @param {Array} newValue
   */
  const handleChange = (event, newValue) => {
    handleSelect("progress", newValue, progress, setProgress);
  };

  /**
   * Function 4: Resets progress values via useState and LS
   */
  const clearAllProgress = () => {
    setProgress([0, 100]);
    var newFilterObj = {
      ...filterObj,
      progress: [0, 100],
    };
    localStorage.setItem(`filter-${storageName}`, JSON.stringify(newFilterObj));
  };

  /**
   * Function 5: Resets deadline values via useState and LS
   */
  const clearDeadlines = () => {
    setDS(null);
    setDE(null);
    var newFilterObj = {
      ...filterObj,
      deadline: [null, null],
    };
    localStorage.setItem(`filter-${storageName}`, JSON.stringify(newFilterObj));
  };

  /**
   * Function 6: Resets todo date values via useState and LS
   */
  const clearTodoDate = () => {
    setTE(null);
    setTS(null);
    var newFilterObj = {
      ...filterObj,
      todoDate: [null, null],
    };
    localStorage.setItem(`filter-${storageName}`, JSON.stringify(newFilterObj));
  };

  /**
   * Function 7: Resets property filters via useState and LS
   */
  const clearAllProperties = () => {
    setSelectedProperties([]);
    var newFilterObj = {
      ...filterObj,
      properties: [],
    };
    localStorage.setItem(`filter-${storageName}`, JSON.stringify(newFilterObj));
  };

  /**
   * Function 8: Opens the filter pop-up
   */
  const toggleFilterOptions = () => {
    document
      .querySelector(`.${styles.filterOptions}`)
      .classList.toggle(`hidden`);
    setClickF(!clickedF);
  };

  /**
   * Function 9: Opens the sort pop-up
   */
  const toggleSortOptions = () => {
    document.querySelector(`.${styles.sortOptions}`).classList.toggle(`hidden`);
    setClickS(!clickedS);
  };

  /**
   * Function 10: Deletes a list, deleting todos, subtasks and the list from database
   */
  const deleteList = async () => {
    setConfirmDialog({
      ...ConfirmDialog,
      isOpen: false,
    });
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the DELETE task route method
      const deleteTodos = await fetch(`/todos/${listName}/todos`, {
        method: "DELETE",
        headers: { user_id },
      });

      // Calls the DELETE subtasks route method
      const deleteSubtasks = await fetch(`/todos/${listName}/subtasks/`, {
        method: "DELETE",
        headers: { user_id },
      });

      const deleteList = await fetch(`/todos/lists/${listName}/`, {
        method: "DELETE",
        headers: { user_id },
      });
    } catch (err) {
      console.error(err.message);
    }
    window.location = "/taskpage";
  };

  /**
   * Function 11: The main filtering function.
   * @param {String} str The type of filter option used.
   * @param {*} property The value to be filtered.
   * @param {*} arr An array of priorities, deadline start and end, todo date start and end, properties or progress start and end values.
   * @param {*} set The respective setters for each filter.
   */
  const handleSelect = (str, property, arr, set) => {
    var newSelection = null;
    if (str === "priority" || str === "property") {
      // If there is already a selection for the item
      const isSelected = arr.includes(property);
      if (isSelected) {
        newSelection = arr.filter((currProperty) => currProperty !== property);
      } else {
        newSelection = [...arr, property];
      }
      set(newSelection);
    } else if (str === "progress") {
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
        break;
      default:
        console.log("ok");
        break;
    }
    localStorage.setItem(`filter-${storageName}`, JSON.stringify(filter));
  };

  /**
   * Function 12: Gets all unique properties of the user
   */
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
  // Manipulates the style of sorting options
  /**
   * Function 13: Manipuldate the style of sorting options
   * @param {Object} e The event of clicking.
   * @param {int} item The sort option being clicked.
   */
  const sortStyle = (e, item) => {
    e.preventDefault();
    if (item !== sortSelection) {
      document
        .querySelector(`#sort-${item}`)
        .classList.add(`${styles.clickedSortOption}`);
      document
        .querySelector(`#sort-${sortSelection}`)
        .classList.remove(`${styles.clickedSortOption}`);
    } else {
      document
        .querySelector(`#sort-${item}`)
        .classList.remove(`${styles.clickedSortOption}`);
      document
        .querySelector(`#sort-dateAdded`)
        .classList.add(`${styles.clickedSortOption}`);
    }
  };

  /**
   * Function 14: The main sorting function.
   * @param {*} str The type of action. Either sort or direction.
   * @param {*} item The sort option.
   * @param {*} com The variable to be used to store the option.
   * @param {*} set The setter for com.
   */
  const handleSortProper = (str, item, com, set) => {
    // Initialize something
    var newSort = null;
    // For sorting button
    if (str === "sort") {
      // If the item is already in the sort Selection
      if (item === com) {
        if (item === "dateAdded") {
          // Do nothing
        } else {
          set("dateAdded");
        }
        newSort = "dateAdded";
      } else {
        set(item);
        newSort = item;
      }
      // For arrow button
    } else {
      if (item !== com) {
        set(item);
        newSort = item;
      }
    }
    var sortInfo;
    switch (str) {
      case "sort":
        sortInfo = {
          sort: newSort,
          direction: direction,
        };
        break;
      case "direction":
        sortInfo = {
          sort: sortSelection,
          direction: newSort,
        };
        break;
      default:
        console.log("ok");
        break;
    }
    localStorage.setItem(`sort-${storageName}`, JSON.stringify(sortInfo));
  };
  /**
   * Function 15: Change the style of sorting options
   */
  const assignSort = () => {
    if (localStorage.getItem(`sort-${storageName}`) == null) {
      document
        .querySelector(`#sort-dateAdded`)
        .classList.add(`${styles.clickedSortOption}`);
    } else {
      document
        .querySelector(`#sort-${sortSelection}`)
        .classList.add(`${styles.clickedSortOption}`);
    }
  };

  /**
   * Function 16: Resets the sorting options
   * @param {Object} e The object being clicked.
   */
  const clearSort = (e) => {
    var newSort = { sort: "dateAdded", direction: "descending" };
    setSS("dateAdded");
    setDirection("descending");
    sortStyle(e, sortSelection);
    localStorage.setItem(`sort-${storageName}`, JSON.stringify(newSort));
  };
  // Called when rendered, adding or deleting a task
  useEffect(() => getProperties(), [todos]);
  useEffect(() => assignSort(), []);
  // The component
  return (
    <div className={styles.buttonZs}>
      <div className={styles.buttonDiv}>
        <Tooltip title="Filter" placement="right-end">
          <Fab
            style={{ backgroundColor: `${clickedF ? "red" : "#4b4b4b"}` }}
            size="small"
            aria-label="filter"
            className={styles.filterButton}
            onClick={toggleFilterOptions}
          >
            {clickedF ? <ClearIcon /> : <FilterListRoundedIcon />}
          </Fab>
        </Tooltip>
        <Tooltip title="Sort" placement="right-end">
          <Fab
            style={{ backgroundColor: `${clickedS ? "red" : "#4b4b4b"}` }}
            size="small"
            aria-label="sort"
            className={styles.sortButton}
            onClick={toggleSortOptions}
          >
            {clickedS ? <ClearIcon /> : <SortRoundedIcon />}
          </Fab>
        </Tooltip>
        {name !== "mt" ? (
          <Fragment>
            <Tooltip title="Delete list" placement="right-end">
              <Fab
                style={{ backgroundColor: "#4b4b4b" }}
                size="small"
                aria-label="delete"
                className={styles.deleteButton}
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: "Are you sure to delete this list?",
                    subTitle:
                      "All tasks in the list would be deleted. You can't undo this operation.",
                    onConfirm: () => {
                      deleteList();
                    },
                  });
                }}
              >
                <HighlightOffRoundedIcon />
              </Fab>
            </Tooltip>
            <ConfirmDialog
              confirmDialog={confirmDialog}
              setConfirmDialog={setConfirmDialog}
            />
          </Fragment>
        ) : (
          <Fragment></Fragment>
        )}
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
                    data-testid={"priority" + item}
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
                  onChange={(date) => setDS(date)}
                  onCalendarClose={() =>
                    handleSelect(
                      "deadline",
                      deadlineStart,
                      [deadlineStart, deadlineEnd],
                      setDS
                    )
                  }
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Start"
                  className={`${styles.deadlineInput} deadlineStartDate`}
                  data-testid="deadlineStart"
                  maxDate={
                    deadlineEnd == null ? undefined : new Date(deadlineEnd)
                  }
                />
                <DatePicker
                  selected={deadlineEnd == null ? null : new Date(deadlineEnd)}
                  data-testid="deadlineEnd"
                  dateFormat="dd-MM-yyyy"
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
                  data-testid="todoDateStart"
                  dateFormat="dd-MM-yyyy"
                  selected={todoStart == null ? null : new Date(todoStart)}
                  onChange={(date) =>
                    handleSelect("todoDate", date, [date, todoEnd], setTS)
                  }
                  placeholderText="Start"
                  className={styles.deadlineInput}
                  maxDate={todoEnd == null ? undefined : new Date(todoEnd)}
                />
                <DatePicker
                  data-testid="todoDateEnd"
                  dateFormat="dd-MM-yyyy"
                  selected={todoEnd == null ? null : new Date(todoEnd)}
                  onChange={(date) =>
                    handleSelect("todoDate", date, [todoStart, date], setTE)
                  }
                  placeholderText="End"
                  className={styles.deadlineInput}
                  minDate={todoStart == null ? undefined : new Date(todoStart)}
                />
                <ClearIcon
                  className={styles.clearDeadlines}
                  onClick={clearTodoDate}
                />
              </div>
            </div>
          </div>
          <div>
            <div className={styles.Tag}>Properties</div>
            <div className={styles.propertyButtons}>
              <div className={styles.propertyButtonList}>
                {properties.map((property, index) => {
                  const isSelected = selectedProperties.includes(property);
                  return (
                    <div className={styles.propertyButton}>
                      <label
                        htmlFor={`property-${index}`}
                        className={styles.propertyName}
                      >
                        {property}
                      </label>
                      <CustomColorCheckbox
                        className={styles.checkIt}
                        name={`property-${index}`}
                        key={index}
                        disableRipple
                        checked={isSelected}
                        onChange={() =>
                          handleSelect(
                            "property",
                            property,
                            selectedProperties,
                            setSelectedProperties
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <ClearIcon
                className={styles.clearDeadlines}
                onClick={clearAllProperties}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.sortOptions} hidden`}>
          <div className={styles.topText}>Sorting Options</div>
          <div className={styles.sortBox}>
            <ul className={styles.sortList}>
              <li
                key={`sort_4`}
                className={styles.sortItems}
                onClick={(e) => {
                  sortStyle(e, "dateAdded");
                  handleSortProper("sort", "dateAdded", sortSelection, setSS);
                }}
                id="sort-dateAdded"
              >
                Date Added{" "}
                {direction === "descending"
                  ? "(Latest - Oldest)"
                  : "(Oldest - Latest)"}
              </li>
              {initialSort.map((item, index) => (
                <li
                  key={`sort_${index}`}
                  className={styles.sortItems}
                  onClick={(e) => {
                    sortStyle(e, item);
                    handleSortProper("sort", item, sortSelection, setSS);
                  }}
                  id={`sort-${item}`}
                >
                  {item}
                  {item !== "Alphabetical"
                    ? ""
                    : direction === "descending"
                    ? " (Z-A)"
                    : " (A-Z)"}
                  {item !== "Priority"
                    ? ""
                    : direction === "descending"
                    ? " (Highest-Lowest)"
                    : " (Lowest-Highest)"}
                  {item !== "Progress"
                    ? ""
                    : direction === "descending"
                    ? " (Highest-Lowest)"
                    : " (Lowest-Highest)"}
                  {item !== "Deadline"
                    ? ""
                    : direction === "descending"
                    ? " (Furthest-Closest)"
                    : " (Closest-Furthest)"}
                </li>
              ))}
              <li
                key={`sort_5`}
                className={styles.sortItems}
                onClick={(e) => {
                  sortStyle(e, "todoDate");
                  handleSortProper("sort", "todoDate", sortSelection, setSS);
                }}
                id="sort-todoDate"
              >
                Todo Date{" "}
                {direction === "descending"
                  ? "(Furthest - Closest)"
                  : "(Closest - Furthest)"}
              </li>
            </ul>
            <div className={styles.sortArrows}>
              Sorted by{" "}
              <span className={styles.spanDirection}>{direction}</span>
              <div>
                {direction === "descending" ? (
                  <ArrowDownwardRoundedIcon
                    onClick={(e) => {
                      e.preventDefault();
                      handleSortProper(
                        "direction",
                        "ascending",
                        direction,
                        setDirection
                      );
                    }}
                    className={styles.arrowStyle}
                  />
                ) : (
                  <ArrowUpwardRoundedIcon
                    onClick={(e) => {
                      e.preventDefault();
                      handleSortProper(
                        "direction",
                        "descending",
                        direction,
                        setDirection
                      );
                    }}
                    className={styles.arrowStyle}
                  />
                )}
              </div>
              <div className={styles.clearSort}>
                Reset
                <ClearIcon
                  className={styles.clearSortButton}
                  onClick={clearSort}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FSD;
