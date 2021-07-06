import React, { Fragment, useState, useEffect } from "react";
import styles from "./Profile.module.css";
import Background from "../Background";
import { Avatar } from "@material-ui/core";
import profile from "../../meileng.jpeg";
import app from "../../base";
import firebase from "firebase";
import "firebase/auth";
const Profile = () => {
  const user = app.auth().currentUser;
  const displayName = user.displayName;
  const email = user.email;
  const [name, setName] = useState("");
  const [emailNew, setEN] = useState("");
  const [emailOld, setEO] = useState("");
  const [password, setPassword] = useState("");
  const [passwordOld, setPO] = useState("");
  const editPassword = () => {
    document.querySelector(`.${styles.forms}`).classList.toggle("hidden");
    // Clear all previous input
  };
  const changeData = (e) => {
    e.preventDefault();
    const credentials = firebase.auth.EmailAuthProvider.credential(
      emailOld,
      passwordOld
    );
    user
      .reauthenticateWithCredential(credentials)
      .then(() => {
        user.updateProfile({ displayName: `${name}` });
        // Cannot update for some reason
        user.updateEmail(emailNew);
        user.updatePassword(password);
        document.querySelector(`.${styles.forms}`).classList.add("hidden");
      })
      .catch((err) => console.error(err));
  };
  return (
    <Background>
      <div className={styles.topPart}>
        <Avatar alt="Mei Leng" src={profile} className={styles.profilePic} />
        <div className={styles.details}>
          <div className={styles.displayName}>{displayName + "'s profile"}</div>
          <div className={styles.emailStuff}>Email: {email} </div>
          <div className={styles.password} onClick={editPassword}>
            Change Details
          </div>
        </div>
      </div>
      <form
        className={`${styles.forms} hidden`}
        onSubmit={(e) => changeData(e)}
      >
        <label>
          {" "}
          New Name:
          <input
            type="text"
            className={`${styles.inputName} `}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          {" "}
          Old Email:
          <input
            type="email"
            className={`${styles.inputEmail}`}
            value={emailOld}
            onChange={(e) => setEO(e.target.value)}
          />
        </label>
        <label>
          {" "}
          New Email:
          <input
            type="email"
            className={`${styles.inputEmail}`}
            value={emailNew}
            onChange={(e) => setEN(e.target.value)}
          />
        </label>
        <label>
          {" "}
          Old Password:
          <input
            type="password"
            className={`${styles.inputPassword}`}
            value={passwordOld}
            onChange={(e) => setPO(e.target.value)}
          />
        </label>
        <label>
          {" "}
          New Password:
          <input
            type="password"
            className={`${styles.inputPassword}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className={styles.buttons}>
          <button type="submit" className={styles.confirm}>
            Confirm
          </button>
          <button type="button" className={styles.cancel}>
            Cancel
          </button>
        </div>
      </form>
    </Background>
  );
};
export default Profile;
