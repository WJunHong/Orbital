// Imports
import React, { Fragment, useState, useEffect } from "react";
import app from "../../base";

// Style imports
import "../../design/TaskBox.css";
import { Avatar } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import profile from "../../meileng.jpeg";
import styles from "./Heading.module.css";
import FaceRoundedIcon from "@material-ui/icons/FaceRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
});
const Heading = () => {
  var counter = 0;
  const user = app.auth().currentUser;
  const displayName = user.displayName;
  const [time, setTime] = useState("Morning");
  var opac = 1;
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
            <a href="#">HOME</a>
            <a href="#">LEARN</a>
            <a href="#">SETTINGS</a>
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
