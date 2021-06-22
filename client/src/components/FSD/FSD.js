import React, { useState, useEffect } from "react";
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
const FSD = () => {
  const [priority, setPriority] = useState([]);
  const [progress, setProgress] = useState([0, 99]);
  const [deadlineStart, setDS] = useState(null);
  const [deadlineEnd, setDE] = useState(null);
  const [todoStart, setTS] = useState(null);
  const [todoEnd, setTE] = useState(null);
  const handleClick = (e, num) => {
    if (e.target.style.backgroundColor != "black") {
      e.target.style.backgroundColor = "black";
    } else {
      e.target.style.backgroundColor = "#414141";
    }

    if (priority.includes(num)) {
      setPriority(priority.filter((i) => i != num));
    } else {
      setPriority([...priority, num]);
    }
  };
  const deleteAllPriority = () => {
    document
      .querySelectorAll(`.${styles.priorityButton}`)
      .forEach((i) => (i.style.backgroundColor = "#414141"));
    setPriority([]);
  };
  const handleChange = (event, newValue) => {
    setProgress(newValue);
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
  //Testing
  useEffect(() => {
    console.log(priority);
  }, [priority]);
  useEffect(() => {
    console.log(progress);
  }, [progress]);
  return (
    <div className={styles.buttonZs}>
      <div className={styles.buttonDiv}>
        <Fab size="small" aria-label="filter" className={styles.filterButton}>
          <FilterListRoundedIcon />
        </Fab>
        <Fab size="small" aria-label="filter" className={styles.sortButton}>
          <SortRoundedIcon />
        </Fab>
      </div>
      <div className={styles.filterOptions}>
        <div className={styles.topText}>Filter Options:</div>
        <div>
          <div className={styles.Tag}>Priority</div>
          <ul className={styles.priorityButtons}>
            <li
              className={styles.priorityButton}
              onClick={(e) => handleClick(e, 1)}
            >
              1
            </li>
            <li
              className={styles.priorityButton}
              onClick={(e) => handleClick(e, 2)}
            >
              2
            </li>
            <li
              className={styles.priorityButton}
              onClick={(e) => handleClick(e, 3)}
            >
              3
            </li>
            <li
              className={styles.priorityButton}
              onClick={(e) => handleClick(e, 4)}
            >
              4
            </li>
            <li
              className={styles.priorityButton}
              onClick={(e) => handleClick(e, 5)}
            >
              5
            </li>
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
                max={99}
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
                selected={deadlineStart}
                onChange={(date) => setDS(date)}
                placeholderText="Start"
                className={styles.deadlineInput}
                maxDate={deadlineEnd}
              />
              <DatePicker
                selected={deadlineEnd}
                onChange={(date) => setDE(date)}
                placeholderText="End"
                className={styles.deadlineInput}
                minDate={deadlineStart}
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
                onChange={(date) => setTS(date)}
                placeholderText="Start"
                className={styles.deadlineInput}
                maxDate={todoEnd}
              />
              <DatePicker
                selected={todoEnd}
                onChange={(date) => setTE(date)}
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
        </div>
      </div>
      {/*<div className={styles.sortOptions}>Something big</div>*/}
    </div>
  );
};

export default FSD;
