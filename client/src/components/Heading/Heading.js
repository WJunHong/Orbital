// Imports
import React, { useState, useEffect } from "react";
import app from "../../base";

// Style imports
import "../../design/TaskBox.css";
import { Avatar } from "@material-ui/core";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import profile from "../../meileng.jpeg";
import styles from "./Heading.module.css";
import FaceRoundedIcon from "@material-ui/icons/FaceRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import LocalLibraryRoundedIcon from "@material-ui/icons/LocalLibraryRounded";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import { Tooltip } from "../../design/table_icons";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
});
const Heading = () => {
  const user = app.auth().currentUser;
  const displayName = user.displayName;
  const [time, setTime] = useState("Morning");

  const toggleProfile = (e) => {
    e.preventDefault();
    document.getElementById("profileD").classList.toggle(`${styles.hidden}`);
  };
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
          <a href="/" className={styles.logo}></a>
          <div className={styles.navigation}>
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
          </div>
          <div className={styles.time}>{`Good ${time} ${
            displayName == null ? "" : ", " + displayName
          }`}</div>
          <div className={styles.avatarControl}>
            <Avatar
              alt="Mei Leng"
              src={profile}
              className={styles.profile}
              onClick={(e) => toggleProfile(e)}
            />
          </div>
        </nav>
        <div
          id="profileD"
          className={`${styles.profileDropdown} ${styles.hidden}`}
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
