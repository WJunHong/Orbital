// Imports
import React, { useState, useEffect } from "react";
import app from "../../base";

// Style imports
import "../../design/TaskBox.css";

import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import profile from "../../avatar-icon.jpg";
import styles from "./Heading.module.css";

import {
  Avatar,
  FaceRoundedIcon,
  ExitToAppRoundedIcon,
} from "../../design/table_icons";

const theme = createTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
});
/**
 * The Heading component
 * @returns Functional component representing the top bar
 */
const Heading = ({ testUser }) => {
  // The current user
  const user = app.auth().currentUser || testUser;
  const displayName = user.displayName;
  // Timing of the day
  const [time, setTime] = useState("Morning");
  /**
   * Function 1: The profile tab toggle.
   * @param {Object} e The click event.
   */
  const toggleProfile = (e) => {
    e.preventDefault();
    document.getElementById("profileD").classList.toggle(`${styles.hidden}`);
  };
  /**
   * Function 2: Returns the current time of day.
   */
  const currentTime = () => {
    const time = new Date().getHours();
    if (time >= 6 && time < 12) {
      setTime("Morning");
    } else if (time >= 12 && time < 19) {
      setTime("Afternoon");
    } else if (time >= 19 && time < 21) {
      setTime("Evening");
    } else {
      setTime("Night");
    }
  };

  useEffect(() => {
    currentTime();
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <nav className={styles.heading}>
          <a href="/home" className={styles.logo}></a>
          <div className={styles.navigation}>
            {/*
            <a href="/home" className={styles.first}>
              HOME
            </a>
            <a href="#" className={styles.first}>
              LEARN
            </a>
            <a href="#" className={styles.first}>
              SETTINGS
            </a>
            <Tooltip title="Home" placement="bottom">
              <a href="/home" className={styles.diff}>
                <HomeRoundedIcon size="small" />
              </a>
            </Tooltip>
            <Tooltip title="Learn" placement="bottom">
              <a href="#" className={styles.diff}>
                <LocalLibraryRoundedIcon size="small" />
              </a>
            </Tooltip>
            <Tooltip title="Settings" placement="bottom">
              <a href="#" className={styles.diff}>
                <SettingsRoundedIcon size="small" />
              </a>
            </Tooltip>
            */}
          </div>
          <div
            id="greeting"
            data-testid="greeting"
            className={styles.time}
          >{`Good ${time}${
            displayName == null ? "" : ", " + displayName
          }`}</div>
          <div className={styles.avatarControl}>
            <Avatar
              alt="Mei Leng"
              src={profile}
              className={styles.profile}
              data-testId="headingDP"
              onClick={(e) => toggleProfile(e)}
            />
          </div>
        </nav>
        <div
          id="profileD"
          className={`${styles.profileDropdown} ${styles.hidden}`}
          data-testid="profileDropdown"
        >
          <ul>
            <li className={styles.tabProfile}>
              <Avatar alt="Mei Leng" src={profile} />
              <div className={styles.tabName}>{displayName}</div>
            </li>
            <li>
              <a href="/profile" className={styles.profSettings}>
                <FaceRoundedIcon
                  fontSize="small"
                  className={styles.profileIcon}
                />
                <span className={styles.profileTab}>Profile Settings</span>
              </a>
            </li>
            <li>
              <a href="/login" onClick={() => app.auth().signOut()}>
                <ExitToAppRoundedIcon
                  fontSize="small"
                  className={styles.logoutIcon}
                />
                <span className={styles.logout}>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </ThemeProvider>
    </>
  );
};
// 14 max profile name length
export default Heading;
