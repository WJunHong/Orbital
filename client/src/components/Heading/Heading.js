// Imports
import React, { Fragment, useState } from "react";

// Style imports
import "../../design/TaskBox.css";
import { Avatar } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import profile from "../../meileng.jpeg";
import styles from "./Heading.module.css";

const Heading = ({ setAuth }) => {
  const [time, setTime] = useState("Morning");

  const currentTime = () => {
    const time = new Date().getHours();
    if (time >= 6 && time < 12) {
      setTime("Morning");
    } else if (time >= 12 && time < 7) {
      setTime("Afternoon");
    } else if (time >= 7 && time < 9) {
      setTime("Evening");
    } else {
      setTime("Night");
    }
  };
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

  return (
    <>
      <nav className={styles.heading}>
        <a href="#" className={styles.logoLink}>
          <div className={styles.logo}></div>
        </a>
        <div className={styles.navigation}>
          <a href="#">
            <div>HOME</div>
          </a>
          <a href="#">
            <div>LEARN</div>
          </a>
          <a href="#">
            <div>SETTINGS</div>
          </a>
        </div>
        <div className={styles.time}>Good {time}</div>
        <div className={styles.avatarControl}>
          <Avatar alt="Mei Leng" src={profile} className={styles.profile} />
        </div>
      </nav>
      <button onClick={(e) => logout(e)} className="btn btn-primary">
        Logout
      </button>
    </>
  );
};

export default Heading;
