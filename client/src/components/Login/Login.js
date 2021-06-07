import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";

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

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [email_err, setEE] = useState(false);
  const [password_err, setPE] = useState(false);
  const [email_label, setEL] = useState("Email");
  const [password_label, setPL] = useState("Password");

  const toggleErrorMsg = () => {
    // Add error to textfields with invalid input
    if (password === "" && email === "") {
      setEE(true);
      setPE(true);
      setEL("Please enter email");
      setPL("Please enter password");
    } else {
      setEE(true);
      setPE(false);
      setEL("Please enter valid email");
      setPL("Password");
    }
  };
  //const { email, password } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const SubmitForm = async (e) => {
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
        toggleErrorMsg();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

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
                    spacing={3}
                  >
                    <Grid item>
                      <TextField
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
                      <Grid item>
                        <a href="#" className={styles.forgetPassword}>
                          Forget Password?
                        </a>
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

export default Login;
