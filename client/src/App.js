import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
// Imports
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
// import Home from "./Home";
// import SignUp from "./SignUp";
// import Login from "./Login";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

// Components

import TaskPage from "./components/TaskPage";
import Login from "./components/Login/Login";
import Register from "./components/Register";
import Overview from "./components/Overview";
import Profile from "./components/Profile";
import Calendar from "./components/Calendar";
import Home from "./components/Home";

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
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/lists/:listName" component={TaskPage} />
          <PrivateRoute exact path="/calendar" component={Calendar} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
