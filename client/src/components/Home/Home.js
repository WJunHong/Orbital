import React, { Fragment, useState, useEffect } from "react";

import styles from "./Home.module.css";
import {
  ExitToAppRoundedIcon,
  KeyboardReturnRoundedIcon,
  Button,
} from "../../design/table_icons";

import app from "../../base";
import fire from "./fire.png";
import njs from "./njs.png";
import psl from "./psql.png";
import rct from "./react.png";
import git from "./git.png";

/**
 * The home page.
 * @returns Functional Component representing home page.
 */
const Home = () => {
  // State of clicking
  const [selection, setSelection] = useState(1);
  const user = app.auth().currentUser;
  /**
   * Function 1: Styling of clicked option and image shown.
   */
  const changeIt = () => {
    if (selection === 1) {
      document.querySelector(".middlelist1").style.backgroundColor = "#2b2b5a";
      document.querySelector(".middlelist2").style.backgroundColor =
        "#00000000";
      document.querySelector(".middlelist3").style.backgroundColor =
        "#00000000";
    } else if (selection === 2) {
      document.querySelector(".middlelist2").style.backgroundColor = "#2b2b5a";
      document.querySelector(".middlelist1").style.backgroundColor =
        "#00000000";
      document.querySelector(".middlelist3").style.backgroundColor =
        "#00000000";
    } else {
      document.querySelector(".middlelist3").style.backgroundColor = "#2b2b5a";
      document.querySelector(".middlelist2").style.backgroundColor =
        "#00000000";
      document.querySelector(".middlelist1").style.backgroundColor =
        "#00000000";
    }
  };
  useEffect(() => changeIt(), [selection]);
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.heading}>
          <ul>
            <li>
              {user !== null ? (
                <>
                  <KeyboardReturnRoundedIcon />
                  <a href="/">
                    <p>Return to Overview</p>
                  </a>{" "}
                </>
              ) : (
                <div />
              )}
            </li>
            <li>
              <ExitToAppRoundedIcon className={styles.register} />
              <a href="/register">
                <p>Register</p>
              </a>
              <span className={styles.divi}>|</span>
              <a href="/login">
                <p>Login</p>
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.topMost}>
          <div className={styles.top}>
            <h1 className={styles.welcome}>
              Welcome to <span className={styles.tick}>Tick</span>aholic
            </h1>

            <h2 className={styles.welcome2}>
              <span className={styles.tick}>Plan</span> Now, Worry{" "}
              <span className={styles.tick}>Never</span>
            </h2>
            <h3 className={styles.welcome3}>
              Tired of being unable to plan your busy schedule? This is the web
              app for you!
            </h3>
            <div className={styles.topButtons}>
              <Button
                variant="contained"
                className={styles.button1}
                href="/register"
              >
                Start Now
              </Button>
              <Button
                variant="outlined"
                className={styles.button2}
                href="https://docs.google.com/document/d/1iQQgKhjtYIGrFVNQrUs0oHZr85sqSw9n_SOxQfuN88k/edit#heading=h.86a9cj48dznl"
                target="_blank"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className={styles.mainImage} />
        </div>
        <div className={styles.tip}></div>
        <div className={styles.middle}>
          <h2 className={styles.featuresHead}>Features</h2>
          <div className={styles.middle2}>
            <div className={styles.middleL}>
              <ul className={styles.middleList}>
                <li
                  className="middlelist1"
                  style={{ backgroundColor: "#2b2b5a" }}
                  onClick={(e) => {
                    document
                      .querySelector(`.${styles.middleR1}`)
                      .classList.remove("hidden");
                    document
                      .querySelector(`.${styles.middleR2}`)
                      .classList.add("hidden");
                    document
                      .querySelector(`.${styles.middleR3}`)
                      .classList.add("hidden");
                    setSelection(1);
                  }}
                >
                  <p className={styles.middleList1}>Tasks</p>
                  <p>
                    <span className={styles.tick2}>Manage</span> daily tasks
                    with ease <br />
                    <span className={styles.tick2}>Use</span> subtasks to break
                    down larger tasks
                    <br />
                    <span className={styles.tick2}>Create</span> your own
                    properties for extra detail
                    <br />
                    <span className={styles.tick2}>Track</span> your progress
                    with a progress bar
                    <br />
                    <span className={styles.tick2}>Filter</span> and sort tasks
                    for easy viewing
                  </p>
                </li>
                <li
                  className="middlelist2"
                  onClick={(e) => {
                    document
                      .querySelector(`.${styles.middleR2}`)
                      .classList.remove("hidden");
                    document
                      .querySelector(`.${styles.middleR1}`)
                      .classList.add("hidden");
                    document
                      .querySelector(`.${styles.middleR3}`)
                      .classList.add("hidden");
                    setSelection(2);
                  }}
                >
                  <p className={styles.middleList1}>Calendar</p>
                  <p>
                    <span className={styles.tick2}>Keep track</span> of
                    important events
                    <br />
                    <span className={styles.tick2}>View and manage</span> tasks
                    directly
                    <br />
                    <span className={styles.tick2}>Change</span> viewing options
                    to suit your needs
                    <br />
                    <span className={styles.tick2}> Sync</span> events with
                    Google Calendar
                  </p>
                </li>
                <li
                  className="middlelist3"
                  onClick={(e) => {
                    document
                      .querySelector(`.${styles.middleR3}`)
                      .classList.remove("hidden");
                    document
                      .querySelector(`.${styles.middleR2}`)
                      .classList.add("hidden");
                    document
                      .querySelector(`.${styles.middleR1}`)
                      .classList.add("hidden");
                    setSelection(3);
                  }}
                >
                  <p className={styles.middleList1}>Lists</p>
                  <p>
                    <span className={styles.tick2}>Group</span> related tasks
                    <br />
                    <span className={styles.tick2}>Add</span> tasks to other
                    lists
                    <br />
                  </p>
                </li>
              </ul>
            </div>
            <div className={styles.middleR}>
              <div className={styles.middleR1} />
              <div className={`${styles.middleR2} hidden`} />
              <div className={`${styles.middleR3} hidden`} />
            </div>
          </div>
          <div className={styles.middleMid}>
            <h3 className={styles.simpleHead}>
              Simple Design meets Productivity
            </h3>
            <div className={styles.product} />
            {/* TBD */}
            <p></p>
          </div>

          <div className={styles.middleLow}>
            <h3 className={styles.simpleHead}>
              Personalized to remember your needs
            </h3>
            <div className={styles.remember} />
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.apps}>
            <p className={styles.power}>Powered by:</p>
            <ul className={styles.appList}>
              <li>
                <img src={fire} alt="ok" width="50" height="50" />
              </li>
              <li>
                <img src={njs} alt="ok" width="50" height="50" />
              </li>
              <li>
                <img src={psl} alt="ok" width="50" height="50" />
              </li>
              <li>
                <img src={rct} alt="ok" width="50" height="50" />
              </li>
            </ul>
          </div>
          <div>
            <div className={styles.gitStuff}>
              <p>Read our GitHub:</p>
              <a href="https://github.com/WJunHong/Orbital" target="_blank">
                <img src={git} alt="ok" width="50" height="50" />
              </a>
            </div>
            <div className={styles.version}>
              <p>Version 1.4</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
