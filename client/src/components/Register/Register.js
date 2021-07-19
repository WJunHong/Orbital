// Logic imports
import React, { Fragment, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import app from "../../base";

// Style imports
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import styles from "./Register.module.css";
import {
  TextField,
  Grid,
  Paper,
  Button,
  KeyboardReturnRoundedIcon,
} from "../../design/table_icons";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
});

/**
 * The registration page.
 */
const Register = ({ history }) => {
  // name field
  const [name, setName] = useState("");
  const [name_err, setNE] = useState(false);
  const [name_label, setNL] = useState("Name");
  // email field
  const [email, setEmail] = useState("");
  const [email_err, setEE] = useState(false);
  const [email_label, setEL] = useState("Email");
  // password field
  const [password, setPassword] = useState("");
  const [password_err, setPE] = useState(false);
  const [password_label, setPL] = useState("Password");
  // confirm password field
  const [confirm_password, setCP] = useState("");
  const [cpassword_err, setCPE] = useState(false);
  const [confirm_password_label, setCPL] = useState("Confirm Password");
  /**
   * Function 1: Clears all input fields via their useStates. Removes the signup error message.
   */
  const clearAll = () => {
    setNE(false);
    setNL("Name");
    setEE(false);
    setEL("Email");
    setPE(false);
    setPL("Password");
    setCPE(false);
    setCPL("Confirm Password");
    document.getElementById("signupError").style.display = "none";
  };
  /**
   * Function 2: Called when the user submits registration form.
   */
  const SubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      const { name, email, password, confirmPassword } = e.target.elements;
      try {
        clearAll();
        if (
          !validateInfo(
            name.value,
            email.value,
            password.value,
            confirmPassword.value
          )
        ) {
          // do nothing
        } else {
          await app
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value)
            .then((userCred) => {
              userCred.user.updateProfile({ displayName: name.value });
            });
          history.push("/");
        }
      } catch (err) {
        toggleErrorMsg(err.code);
      }
    },
    [history]
  );
  /**
   * Function 3: Displays the error message on registration failure.
   * @param {String} errorMsg
   */
  const toggleErrorMsg = (errorMsg) => {
    const textError = document.getElementById("signupError");
    textError.style.display = "none";
    if (errorMsg === "auth/invalid-email") {
      setEE(true);
      setEL("Invalid email");
    } else {
      setEE(false);
      setEL("Email");
      setPE(false);
      setPL("Password");
      textError.style.display = "inline";
      if (errorMsg === "auth/weak-password") {
        textError.innerHTML = "The password must be 6 characters long or more.";
      } else if (errorMsg === "auth/email-already-in-use") {
        setEE(true);
        textError.innerHTML =
          "The email address is already in use by another account.";
      } else {
        textError.innerHTML = "Undefined error";
      }
    }
  };
  /**
   * Function 4: Validates the name, email and password are non-empty.
   * @param {String} checkName The name.
   * @param {String} checkEmail The email.
   * @param {String} checkPassword The password.
   * @param {String} checkConfirmPassword Reentering the password.
   * @returns A boolean of whether information is non-empty.
   */
  const validateInfo = (
    checkName,
    checkEmail,
    checkPassword,
    checkConfirmPassword
  ) => {
    var validated = true;
    if (checkName === "") {
      setNE(true);
      setNL("Please enter a name");
      validated = false;
    } else {
      setNE(false);
      setNL("Name");
    }

    if (checkEmail === "") {
      setEE(true);
      setEL("Please enter email");
      validated = false;
    } else {
      setEE(false);
      setEL("Email");
    }

    if (checkPassword === "") {
      setPE(true);
      setPL("Please enter password");
      validated = false;
    } else {
      setPE(false);
      setPL("Password");
    }

    if (checkPassword !== checkConfirmPassword) {
      setCPE(true);
      setCPL("Retype Password");
      validated = false;
    }
    return validated;
  };

  return (
    <div className={styles.background}>
      <div className={styles.return}>
        <KeyboardReturnRoundedIcon />
        <a href="/home">
          <p>Return to Home page</p>
        </a>
      </div>
      <Paper elevation={10} className={styles.paperStyle}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={3}>
            <div className={styles.signUpImage}></div>
          </Grid>
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            justify="space-evenly"
            className={styles.signUp}
            xs={9}
          >
            <ThemeProvider theme={theme}>
              <Grid item>
                <Grid item>
                  <h2 className={styles.signUpHeader}>Sign up to Tickaholic</h2>
                </Grid>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                  spacing={1}
                >
                  <Grid item>
                    <h6 className={styles.signedInText}>Already Signed Up?</h6>
                  </Grid>
                  <Grid item>
                    <Link className={styles.loginLink} to="/login">
                      Log In
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <form onSubmit={SubmitForm}>
                  <Grid
                    container
                    direction="column"
                    justify="space-between"
                    spacing={3}
                  >
                    <Grid item>
                      <TextField
                        type="text"
                        name="name"
                        className={styles.signUpBox}
                        error={name_err}
                        label={name_label}
                        placeholder="Name"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        type="email"
                        name="email"
                        className={styles.signUpBox}
                        error={email_err}
                        id="email_input"
                        label={email_label}
                        placeholder="Email"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        name="password"
                        error={password_err}
                        id="password_input"
                        className={styles.signUpBox}
                        label={password_label}
                        placeholder="Password"
                        variant="outlined"
                        type="password"
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        error={cpassword_err}
                        name="confirmPassword"
                        id="confirm_password_input"
                        className={styles.signUpBox}
                        label={confirm_password_label}
                        placeholder="Confirm password"
                        variant="outlined"
                        value={confirm_password}
                        onChange={(e) => setCP(e.target.value)}
                        type="password"
                      />
                    </Grid>
                    <Grid item>
                      <span id="signupError" className={styles.errorInput}>
                        hi
                      </span>
                    </Grid>
                    <Grid item>
                      <Button
                        className={`${styles.signUpBox} ${styles.button}`}
                        variant="contained"
                        type="submit"
                      >
                        Sign up
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </ThemeProvider>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default withRouter(Register);
