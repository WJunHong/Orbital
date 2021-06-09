// Imports
import React, { Fragment, useState, useEffect } from "react";

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
const Heading = ({ setAuth }) => {
  var counter = 0;
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

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      setAuth(false);
      //toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };
  {
    /*<a
    href="/login"
    onClick={(e) => logout(e)}
    className={styles.logout}
  >
    Logout
    </a>*/
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <nav className={styles.heading}>
          <a href="#" className={styles.logo}></a>
          <div className={styles.navigation}>
            <a href="#">HOME</a>
            <a href="#">LEARN</a>
            <a href="#">SETTINGS</a>
          </div>
          <div className={styles.time}>Good {time}</div>
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
              <div className={styles.tabName}>User</div>
            </li>
            <li>
              <a href="/" className={styles.logout}>
                <FaceRoundedIcon
                  fontSize="small"
                  className={styles.profileIcon}
                />
                <text className={styles.profileTab}>View Profile</text>
              </a>
            </li>
            <li>
              <a href="/login" onClick={(e) => logout(e)}>
                <ExitToAppRoundedIcon
                  fontSize="small"
                  className={styles.logoutIcon}
                />
                <text className={styles.logout}>Logout</text>
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
