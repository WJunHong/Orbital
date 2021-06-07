// Logic imports
import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";

// Style imports
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import styles from "./Register.module.css";
import GoogleButton from "react-google-button";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
});
// The registration component page
const Register = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setCP] = useState("");
  const [email_err, setEE] = useState(false);
  const [password_err, setPE] = useState(false);
  const [cpassword_err, setCPE] = useState(false);
  const [email_label, setEL] = useState("Email");
  const [password_label, setPL] = useState("Password");
  const [confirm_password_label, setCPL] = useState("Confirm Password");

  const toggleErrorMsg = () => {
    // Add error to textfields with invalid input
    if (password === "" && email === "") {
      setEE(true);
      setPE(true);
      setCPE(true);
      setEL("Please enter email");
      setPL("Please enter password");
      setCPL("Please confirm password");
    } else {
      setEE(true);
      setPE(false);
      setCPE(false);
      setEL("Please enter valid email");
      setPL("Password");
      setCPL("Confirm Password");
    }
  };
  const wrongPassword = () => {
    setCPE(true);
    setCPL("Retype Password");
  };
  const SubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { name, email, password };
      if (password != confirm_password) {
        wrongPassword();
      } else {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        });
        // Returns the JWT token, if the email and password are valid
        const parseRes = await response.json();

        // If there is a JWT token, place it in localStorage as token, and make the user authorized.
        if (parseRes.token) {
          localStorage.setItem("token", parseRes.token);
          localStorage.setItem("auth", true);
          setAuth(true);
        } else {
          setAuth(false);
          toggleErrorMsg();
        }
      }
      // Make a post request to register route, providing all info needed
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
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
                        className={styles.signUpBox}
                        label="Name"
                        placeholder="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        inputProps={{
                          autoComplete: "new-password",
                          form: {
                            autoComplete: "off",
                          },
                        }}
                      />
                    </Grid>
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
                      <TextField
                        error={cpassword_err}
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
    </Fragment>
  );
};

export default Register;
