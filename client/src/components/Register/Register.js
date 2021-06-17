// Logic imports
import React, { Fragment, useState, useCallback } from "react";
import { Link, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import app from "../../base";

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
/*
const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );
*/
// The registration component page
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

  const SubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      const { name, email, password } = e.target.elements;
      try {
        /*if (password != confirm_password) {
          wrongPassword();
        } else {*/
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then((userCred) => {
            userCred.user.updateProfile({ displayName: name.value });
          });
        history.push("/");
        // superErrorMsg(parseRes);
      } catch (err) {
        // superErrorMsg(err);
        console.log(err.code);
        console.error(err.message);
        switch(err.code) {
          case "ERROR_INVALID CREDENTIAL":
            err.message = "Wrong credentials";
            break;
          default:
            err.message = "Undefined error";
        }
      }
    },
    [history]
  );

  const superErrorMsg = (errorMsg) => {
    if (errorMsg === "Missing Credentials") {
      if (name === "") {
        setNE(true);
        setNL("Please enter a Name");
      } else {
        setNE(false);
        setNL("Name");
      }
      if (email === "") {
        setEE(true);
        setEL("Invalid Email");
      } else {
        setEE(false);
        setEL("Email");
      }
      if (password === "") {
        setPE(true);
        setPL("Please enter Password");
        setCPE(true);
        setCPL("No Password");
      } else {
        if (!passwordCheck()) {
          setCPE(true);
          setCPL("Password Mismatch");
          setPE(false);
          setPL("Password");
        } else {
          setPE(false);
          setPL("Password");
          setCPE(false);
          setCPL("Password Matched");
        }
      }
    } else if (errorMsg === "Invalid Email") {
      setEE(true);
      setEL(errorMsg);
      if (!passwordCheck()) {
        setCPE(true);
        setCPL("Password Mismatch");
        setPE(false);
        setPL("Password");
      } else {
        setPE(false);
        setPL("Password");
        setCPE(false);
        setCPL("Password Matched");
      }
      setNE(false);
      setNL("Name");
    } else if (errorMsg === "User already exist") {
      setEE(true);
      setEL(errorMsg);
      if (!passwordCheck()) {
        setCPE(true);
        setCPL("Password Mismatch");
      }
    }
  };
  const passwordCheck = () => {
    return password == confirm_password;
  };
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

export default withRouter(Register);
