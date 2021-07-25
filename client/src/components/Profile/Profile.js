import React, { useState } from "react";

import Background from "../Background";
import profile from "../../avatar-icon.jpg";
// Firebase
import app from "../../base";
import firebase from "firebase";
import "firebase/auth";
// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Style imports
import { Tooltip, Avatar, EditRoundedIcon } from "../../design/table_icons";
import styles from "./Profile.module.css";
/**
 * The profile page.
 * @returns Functional component representing the profile page.
 */
const Profile = () => {
  // The user information fetched from firebase
  const user = app.auth().currentUser;
  // Default values for editable information.
  const [displayName, setDN] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState("");
  const [emailNew, setEN] = useState("");
  const [emailOld, setEO] = useState("");
  const [password, setPassword] = useState("");
  const [passwordOld, setPO] = useState("");
  const [photo, setPhoto] = useState(null);
  /**
   * Function 1: The function called when user changes display name.
   * @param {Object} e The event object when submitting name form.
   */
  const submitForm1 = (e) => {
    e.preventDefault();
    if (name === "") {
      toast.error("Enter a name!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    } else {
      user.updateProfile({ displayName: `${name}` });
      setDN(name);
      document.querySelector(`.${styles.form1}`).classList.add("hidden");
      toast.success("Name Updated!!!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };
  /**
   * Function 2: The function called when the user changes email.
   * @param {Object} e The event of submitting form.
   */
  const submitForm2 = (e) => {
    e.preventDefault();

    if (
      emailOld !== email ||
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        emailNew
      )
    ) {
      toast.error("Enter a valid email!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    } else {
      const credentials = firebase.auth.EmailAuthProvider.credential(
        emailOld,
        passwordOld
      );
      user.reauthenticateWithCredential(credentials).then(() => {
        user.updateEmail(emailNew);
        removeForm2();
        setEmail(emailNew);
        toast.success("Email Updated!!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      });
    }
  };
  /**
   * Function 3: The function called when the user changes password.
   * @param {Object} e The event object of submitting form.
   */
  const submitForm3 = (e) => {
    e.preventDefault();
    const credentials = firebase.auth.EmailAuthProvider.credential(
      email,
      passwordOld
    );
    user
      .reauthenticateWithCredential(credentials)
      .then(() => {
        if (password.length < 6) {
          toast.error("Password must have at least 6 characters!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        }
        user.updatePassword(password);
        removeForm3();
        toast.success("Password Updated!!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      })
      .catch((err) =>
        toast.error("Incorrect old password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        })
      );
  };
  /**
   * Function 4: Shows the name form button.
   */
  const showEdit = () => {
    document.querySelector(`.${styles.editName}`).classList.remove("hidden");
  };
  /**
   * Function 5: Hides the name form button.
   */
  const hideEdit = () => {
    document.querySelector(`.${styles.editName}`).classList.add("hidden");
  };
  /**
   * Function 6: Shows the email form button.
   */
  const showEdit1 = () => {
    document.querySelector(`.${styles.editEmail}`).classList.remove("hidden");
  };
  /**
   * Function 7: Hides the email form button.
   */
  const hideEdit1 = () => {
    document.querySelector(`.${styles.editEmail}`).classList.add("hidden");
  };
  /**
   * Function 8: Opens the name form.
   */
  const showForm1 = () => {
    document.querySelector(`.${styles.form1}`).classList.toggle("hidden");
    setName("");
    removeForm2();
    removeForm3();
  };
  /**
   * Function 9: Closes the name form.
   */
  const removeForm1 = () => {
    setName("");
    document.querySelector(`.${styles.form1}`).classList.add("hidden");
  };
  /**
   * Function 10: Opens the email form.
   */
  const showForm2 = () => {
    document.querySelector(`.${styles.form2}`).classList.toggle("hidden");
    setEN("");
    setEO("");
    removeForm1();
    removeForm3();
  };
  /**
   * Function 11: Closes the email form.
   */
  const removeForm2 = () => {
    setEN("");
    setEO("");
    document.querySelector(`.${styles.form2}`).classList.add("hidden");
  };
  /**
   * Function 12: Closes the password form.
   */
  const removeForm3 = () => {
    setPO("");
    setPassword("");
    document.querySelector(`.${styles.form3}`).classList.add("hidden");
  };
  /**
   * Function 13: Opens the password form.
   */
  const editPassword = () => {
    setPO("");
    setPassword("");
    document.querySelector(`.${styles.form3}`).classList.toggle("hidden");
    removeForm2();
    removeForm1();
  };

  return (
    <>
      <Background>
        <div className={styles.topPart}>
          <Tooltip title="Edit profile picture" placement="bottom-end">
            <Avatar
              alt="Mei Leng"
              src={user.photoURL === null ? profile : user.photoURL}
              className={styles.profilePic}
            />
          </Tooltip>

          <div className={styles.details}>
            <div
              className={styles.displayName}
              onMouseOver={showEdit}
              onMouseLeave={hideEdit}
            >
              <div>{displayName + "'s profile"}</div>
              <Tooltip title="Edit name" placement="bottom-start">
                <EditRoundedIcon
                  size="small"
                  className={`${styles.editName} hidden`}
                  onClick={showForm1}
                />
              </Tooltip>
            </div>
            <form
              className={`${styles.form1} hidden`}
              onSubmit={(e) => submitForm1(e)}
            >
              <input
                type="text"
                placeholder="New Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.inputName}
              />
              <div className={styles.buttons}>
                <button type="submit" className={styles.confirm}>
                  Change
                </button>
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={removeForm1}
                >
                  Cancel
                </button>
              </div>
            </form>
            <div
              className={styles.emailStuff}
              onMouseOver={showEdit1}
              onMouseLeave={hideEdit1}
            >
              <div>Email: {email} </div>
              <Tooltip title="Edit email" placement="bottom-start">
                <EditRoundedIcon
                  size="small"
                  className={`${styles.editEmail} hidden`}
                  onClick={showForm2}
                />
              </Tooltip>
            </div>
            <form className={`${styles.form2} hidden`} onSubmit={submitForm2}>
              <input
                placeholder="Old Email"
                type="text"
                value={emailOld}
                onChange={(e) => setEO(e.target.value)}
                className={styles.inputEmailO}
              />
              <input
                placeholder="New Email"
                type="text"
                value={emailNew}
                onChange={(e) => setEN(e.target.value)}
                className={styles.inputEmail}
              />
              <input
                placeholder="Confirm with Password"
                type="password"
                value={passwordOld}
                onChange={(e) => setPO(e.target.value)}
                className={styles.inputEmail}
              />
              <div className={styles.buttons}>
                <button type="submit" className={styles.confirm}>
                  Change
                </button>
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={removeForm2}
                >
                  Cancel
                </button>
              </div>
            </form>
            <div className={styles.password} onClick={editPassword}>
              Change Password
            </div>
            <form className={`${styles.form3} hidden`} onSubmit={submitForm3}>
              <input
                placeholder="Old Password"
                type="password"
                value={passwordOld}
                onChange={(e) => setPO(e.target.value)}
                className={styles.inputPasswordO}
              />

              <input
                placeholder="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputPassword}
              />
              <div className={styles.buttons}>
                <button type="submit" className={styles.confirm}>
                  Change
                </button>
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={removeForm3}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Background>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
      />
    </>
  );
};
export default Profile;
