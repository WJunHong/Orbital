import React, { Fragment, useState, useCallback, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import app from "../../base";
import { AuthContext } from "../../Auth";

// Styling imports
import {
  KeyboardReturnRoundedIcon,
  Button,
  TextField,
  Grid,
  Paper,
} from "../../design/table_icons";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import styles from "./Login.module.css";
import GoogleButton from "react-google-button";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
});
/**
 * The login component of the application.
 *
 */
const Login = ({ history }) => {
  // email field
  const [email, setEmail] = useState("");
  const [email_err, setEE] = useState(false);
  const [email_label, setEL] = useState("Email");
  // password field
  const [password, setPassword] = useState("");
  const [password_err, setPE] = useState(false);
  const [password_label, setPL] = useState("Password");
  /**
   * Function 1: The function called when the user clicks login.
   */
  const SubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      const { email, password } = e.target.elements;
      try {
        if (!validateInfo(email.value, password.value)) {
          // do nothing
        } else {
          await app
            .auth()
            .signInWithEmailAndPassword(email.value, password.value);
          history.push("/");
        }
      } catch (err) {
        toggleErrorMsg(err.code);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }
  /**
   * Function 2: The function that handles the error messages on login failures.
   * @param {String} errorMsg The type of error that had occurred.
   */
  const toggleErrorMsg = (errorMsg) => {
    const textError = document.getElementById("invalidEP");
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
      if (errorMsg === "auth/too-many-requests") {
        textError.innerHTML = "Excessive login attempts. Try again later.";
      } else if (errorMsg === "auth/wrong-password") {
        textError.innerHTML = "Invalid email or password";
      } else if (errorMsg === "auth/user-not-found") {
        textError.innerHTML = "Email has not been registered";
      } else {
        textError.innerHTML = "Undefined error";
      }
    }
  };
  /**
   * Function 3: Checks if the information passed in is non-empty before it is submitted in submitForm.
   * @param {String} checkEmail The email passed in.
   * @param {String} checkPassword The password passed in.
   * @returns A boolean of whether both email and password are of valid format.
   */
  const validateInfo = (checkEmail, checkPassword) => {
    var validated = true;
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
                  <h2 className={styles.signUpHeader}>Login to Tickaholic</h2>
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
                    <h6 className={styles.signedInText}>
                      Don't have an account?
                    </h6>
                  </Grid>
                  <Grid item>
                    <Link className={styles.loginLink} to="/register">
                      Sign Up
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
                    alignItems="center"
                    spacing={3}
                  >
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Grid>
                    <Grid item container direction="column">
                      <Grid item>
                        <TextField
                          name="password"
                          error={password_err}
                          id="password_input"
                          className={styles.signUpBox}
                          label={password_label}
                          placeholder="Password"
                          variant="outlined"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                        />
                      </Grid>
                      <Grid
                        item
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                      >
                        <Grid item>
                          <a href="#" className={styles.forgetPassword}>
                            Forget Password?
                          </a>
                        </Grid>
                        <Grid item>
                          <span
                            id="invalidEP"
                            className={styles.errorInput}
                          ></span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Button
                        className={`${styles.signUpBox} ${styles.button}`}
                        variant="contained"
                        type="submit"
                        color="primary"
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <Grid item>
                <GoogleButton />
              </Grid>
            </ThemeProvider>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default withRouter(Login);
