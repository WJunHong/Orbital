// Imports
import React, { Fragment, useState } from 'react';
<<<<<<< HEAD
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
=======

>>>>>>> bba4e195f4795bbceaee00b81c707042598a3c4e
import './App.css';

// Components
import InputToDo from './components/InputTodo';
import ListTodo from "./components/ListTodo";
import TaskBox from "./components/TaskBox";
import Heading from "./components/Heading";
import EditTodo from './components/EditTodo';

<<<<<<< HEAD
import Login from "./components/Login";
import Register from "./components/Register";

=======
>>>>>>> bba4e195f4795bbceaee00b81c707042598a3c4e
/**
 * Functional Component of our main app
 * @returns JSX for our main app
 */
<<<<<<< HEAD
/*
=======
>>>>>>> bba4e195f4795bbceaee00b81c707042598a3c4e
function App() {
  return (
      <Fragment>
        <Heading />
        <TaskBox />
      </Fragment>
  );
}
<<<<<<< HEAD
*/

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  return (
    <>
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/login" render={props => 
              !isAuthenticated 
                ? <Login {...props} setAuth={setAuth} />
                : <Redirect to="/" /> 
              }
            />
            <Route exact path="/register" render={props => 
              !isAuthenticated 
                ? <Register {...props} setAuth={setAuth} />
                : <Redirect to="/" /> 
              }
            />
            <Route exact path="/" render={props => 
              isAuthenticated 
                ? <Fragment>
                    <Heading />
                    <TaskBox {...props} setAuth={setAuth} />
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


=======
>>>>>>> bba4e195f4795bbceaee00b81c707042598a3c4e

export default App;
