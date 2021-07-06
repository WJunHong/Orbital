// Imports
import React, { Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
// import Home from "./Home";
// import SignUp from "./SignUp";
// import Login from "./Login";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

// Components

import Heading from "./components/Heading";
import TaskPage from "./components/TaskPage";
import Login from "./components/Login/Login";
import Register from "./components/Register";
import Overview from "./components/Overview";
import SideBar from "./components/SideBar";

/**
 * Functional Component of our main app
 * @returns JSX for our main app
 */
function App() {

  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Overview} />
          <PrivateRoute exact path="/taskpage" component={TaskPage} />
          <PrivateRoute exact path="/lists/:listName" component={TaskPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
