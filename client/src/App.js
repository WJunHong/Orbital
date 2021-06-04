// Imports
import React, { Fragment, useState, useEffect } from 'react';
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import './App.css';

// Components
import Heading from "./components/Heading";
import TaskPage from "./components/TaskPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Overview from "./components/Overview";

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
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  const checkAuthenticated = async () => {
    try {
      const res = await fetch("/auth/verify", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <>
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/login" render={props => {
              if (!isAuthenticated) {
               return (<Login {...props} setAuth={setAuth} />);
              } else {
                setTimeout(3000);
                return (<Redirect to="/" />); 
              }
            }}
            />
            <Route exact path="/register" render={props => 
              !isAuthenticated 
                ? <Register {...props} setAuth={setAuth} />
                : <Redirect to="/" /> 
              }
            />
            <Route exact path="/" render={props => {
              if (isAuthenticated) {
                 return (<Fragment>
                  <Heading setAuth={setAuth} />
                  <Overview {...props} />
                  </Fragment>);
              } else {  
                  setTimeout(3000);
                  return (<Redirect to="/login" />);
              }
            }}
            />
            <Route exact path="/maintask" render={props => {
              if (isAuthenticated) { 
                return (<Fragment>
                  <Heading setAuth={setAuth} />
                  <TaskPage {...props} />
                  </Fragment>)
              } else {
                setTimeout(3000);
                return (<Redirect to="/login" />); 
              }
            }}
            />
            <Route exact path="/calendar" render={props => 
              isAuthenticated 
                ? <Fragment>
                  <Heading setAuth={setAuth} />
                  <TaskPage {...props} />
                  </Fragment>
                : <Redirect to="/login" /> 
              }
            />
          </Switch>
        </div>
      </Router>

    </>
  );
}

export default App;
