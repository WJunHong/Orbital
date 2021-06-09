// Imports
import React, { Fragment, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";

// Components
import Heading from "./components/Heading/Heading";
import TaskPage from "./components/TaskPage";
import Login from "./components/Login/Login";
import Register from "./components/Register";
import Overview from "./components/Overview";
import SideBar from "./components/SideBar";

/**
 * Functional Component of our main app
 * @returns JSX for our main app
 */
/*
function App() {
  return (
      <Fragment>
        <Heading />
        <TaskBox />
      </Fragment>
  );
}
*/

function App() {
  const checkAuthenticated = async () => {
    try {
      // Makes a call to verify route to check if the user is authorized to be in the website
      const res = await fetch("/auth/verify", {
        method: "GET",
        // Sets a header called token - localStorage.token
        headers: { token: localStorage.token },
      });

      const parseRes = await res.json();
      // Checks if token verification is correct, if yes set authentication to true for the webpage
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const checkAuthenticated2 = async () => {
    try {
      // Makes a call to verify route to check if the user is authorized to be in the website
      const res = await fetch("/auth/verify", {
        method: "GET",
        // Sets a header called token - localStorage.token
        headers: { token: localStorage.token },
      });

      const parseRes = await res.json();
      // Checks if token verification is correct, if yes set authentication to true for the webpage
      return parseRes === true;
    } catch (err) {
      console.error(err.message);
    }
  };

  // Everytime the page renders fully, call the function
  useEffect(() => {
    checkAuthenticated();
  }, []);

  // TBD
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };
  return (
    <>
      <Router>
        <div>
          <Switch>
            <Route
              exact
              path="/login"
              render={(props) => {
                if (!isAuthenticated) {
                  return <Login {...props} setAuth={setAuth} />;
                } else {
                  return <Redirect to="/" />;
                }
              }}
            />
            <Route
              exact
              path="/register"
              render={(props) =>
                !isAuthenticated ? (
                  <Register {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route
              exact
              path="/"
              render={(props) => {
                checkAuthenticated();
                if (isAuthenticated) {
                  return (
                    <Fragment>
                      <Heading setAuth={setAuth} />
                      <SideBar />
                      <Overview {...props} />
                    </Fragment>
                  );
                } else {
                  return <Redirect to="/login" />;
                }
              }}
            />
            <Route
              exact
              path="/maintask"
              render={(props) => {
                if (isAuthenticated) {
                  return (
                    <Fragment>
                      <Heading setAuth={setAuth} />
                      <TaskPage {...props} />
                    </Fragment>
                  );
                } else {
                  return <Redirect to="/login" />;
                }
              }}
            />
            <Route
              exact
              path="/calendar"
              render={(props) =>
                isAuthenticated ? (
                  <Fragment>
                    <Heading setAuth={setAuth} />
                    <TaskPage {...props} />
                  </Fragment>
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
