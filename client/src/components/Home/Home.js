import React, { Fragment } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./Home.module.css";

import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import KeyboardReturnRoundedIcon from "@material-ui/icons/KeyboardReturnRounded";
import Button from "@material-ui/core/Button";
import fire from "./fire.png";
import njs from "./njs.png";
import psl from "./psql.png";
import rct from "./react.png";
import git from "./git.png";
const Home = () => {
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.heading}>
          <ul>
            <li>
              <KeyboardReturnRoundedIcon /> <p>Return to Overview</p>
            </li>
            <li>
              <ExitToAppRoundedIcon className={styles.register} />
              <p>Register</p>
              <span className={styles.divi}>|</span>
              <p>Login</p>
            </li>
          </ul>
        </div>
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
            <Button variant="contained" className={styles.button1}>
              Start Now
            </Button>
            <Button variant="outlined" className={styles.button2}>
              Learn More
            </Button>
          </div>
        </div>
        <div className={styles.middle}>
          <h2 className={styles.featuresHead}>Features</h2>
          <div className={styles.middle2}>
            <div className={styles.middleL}>
              <ul className={styles.middleList}>
                <li>
                  <p className={styles.middleList1}>Tasks</p>
                  <p>
                    Manage daily tasks with ease <br />
                    Use subtasks to break down larger tasks
                    <br />
                    Create your own properties for extra detail
                    <br />
                    Track your progress with a progress bar
                    <br />
                    Filter and sort tasks for east viewing
                  </p>
                </li>
                <li>
                  <p className={styles.middleList1}>Calendar</p>
                  <p>
                    Keep track of important events
                    <br />
                    View and manage tasks directly
                    <br />
                    Change viewing options to suit your needs
                    <br />
                    Sync events with Google Calendar
                  </p>
                </li>
                <li>
                  <p className={styles.middleList1}>Lists</p>
                </li>
              </ul>
            </div>
            <div className={styles.middleR}></div>
          </div>
          <h3 className={styles.simpleHead}>
            Simple Design meets Productivity
          </h3>
          <div></div>
          <h3 className={styles.simpleHead}>
            Personalized to remember your needs
          </h3>
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
              <a href="https://github.com/WJunHong/Orbital">
                <img src={git} alt="ok" width="50" height="50" />
              </a>
            </div>
            <div className={styles.version}>
              <p>Version 1.3</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
