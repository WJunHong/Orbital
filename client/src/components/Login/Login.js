import React, { Fragment, useState, useCallback, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import app from "../../base";
import { AuthContext } from "../../Auth";

// Styling imports
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import styles from "./Login.module.css";
import GoogleButton from "react-google-button";
import { lastDayOfQuarter, set } from "date-fns";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
});

const Login = ({ history }) => {
  // email field
  const [email, setEmail] = useState("");
  const [email_err, setEE] = useState(false);
  const [email_label, setEL] = useState("Email");
  // password field
  const [password, setPassword] = useState("");
  const [password_err, setPE] = useState(false);
  const [password_label, setPL] = useState("Password");

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
        textError.innerHTML = "Too many failed login attempts. Please try again later.";
      } else if (errorMsg === "auth/wrong-password") {
        textError.innerHTML = "Invalid email or password";
      } else if (errorMsg === "auth/user-not-found") {
        textError.innerHTML = "Email has not been registered";
      } else {
        textError.innerHTML = "Undefined error";
      }
    }
  }
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
  }

  return (
    <Fragment>
      {/*<h1 className="mt-5 text-center">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => onChange(e)}
          className="form-control my-3"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => onChange(e)}
          className="form-control my-3"
        />
        <button class="btn btn-success btn-block">Submit</button>
      </form>
  <Link to="/register">register</Link>*/}
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
                          <text id="invalidEP" className={styles.errorInput}>
                          </text>
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
    </Fragment>
  );
};

export default withRouter(Login);