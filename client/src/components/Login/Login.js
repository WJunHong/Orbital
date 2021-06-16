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
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (err) {
        console.error(err.message);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  const toggleErrorMsg = (errorMsg) => {
    if (errorMsg === "Missing Credentials") {
      if (email === "") {
        setEE(true);
        setEL("Please enter email");
      } else {
        setEE(false);
        setEL("Email");
      }
      if (password === "") {
        setPE(true);
        setPL("Please enter password");
      } else {
        setPE(false);
        setPL("Password");
      }
    } else if (errorMsg === "Invalid Email") {
      setEE(true);
      setEL(errorMsg);
    } else {
      setEE(false);
      setEL("Email");
      setPE(false);
      setPL("Password");
      document.getElementById("invalidEP").style.display = "inline";
    }
  };
  //const { email, password } = inputs;

  /*const onSubmitForm = async (e) => {
    // Prevent page from reloading
    e.preventDefault();
    try {
      const body = { email, password };
      // Send a login post request with the credentials given. Initally unauthenticated
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // Returns the JWT token
      const parseRes = await response.json();

      // If there is a JWT token, save it to localStorage, and make user authorized to use the web app.
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        localStorage.setItem("auth", true);
        setAuth(true);
      } else {
        setAuth(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };*/

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
                            Invalid email or password
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
