import React, { useState } from "react";
import styles from "./Profile.module.css";
import Background from "../Background";
import { Avatar } from "@material-ui/core";
import profile from "../../meileng.jpeg";
import app from "../../base";
import firebase from "firebase";
import "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { Tooltip } from "../../design/table_icons";
const Profile = () => {
  const user = app.auth().currentUser;
  const [displayName, setDN] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState("");
  const [emailNew, setEN] = useState("");
  const [emailOld, setEO] = useState("");
  const [password, setPassword] = useState("");
  const [passwordOld, setPO] = useState("");

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

  const showEdit = () => {
    document.querySelector(`.${styles.editName}`).classList.remove("hidden");
  };
  const hideEdit = () => {
    document.querySelector(`.${styles.editName}`).classList.add("hidden");
  };
  const showEdit1 = () => {
    document.querySelector(`.${styles.editEmail}`).classList.remove("hidden");
  };
  const hideEdit1 = () => {
    document.querySelector(`.${styles.editEmail}`).classList.add("hidden");
  };
  const showForm1 = () => {
    document.querySelector(`.${styles.form1}`).classList.toggle("hidden");
    setName("");
    removeForm2();
    removeForm3();
  };
  const removeForm1 = () => {
    setName("");
    document.querySelector(`.${styles.form1}`).classList.add("hidden");
  };
  const showForm2 = () => {
    document.querySelector(`.${styles.form2}`).classList.toggle("hidden");
    setEN("");
    setEO("");
    removeForm1();
    removeForm3();
  };
  const removeForm2 = () => {
    setEN("");
    setEO("");
    document.querySelector(`.${styles.form2}`).classList.add("hidden");
  };
  const removeForm3 = () => {
    setPO("");
    setPassword("");
    document.querySelector(`.${styles.form3}`).classList.add("hidden");
  };
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
              src={profile}
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
