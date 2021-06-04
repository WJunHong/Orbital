import React, { Fragment } from 'react';
import '../App.css';
import "../design/TaskBox.css";

// Components
//import TaskBox from "./components/TaskBox";
import Heading from "./Heading";
import InputTodo from "./InputTodo";
import ListTodo from "./ListTodo";
import SideBar from "./SideBar"

const TaskPage = ({ setAuth }) => {
  return (
      <Fragment>
        <Heading setAuth={setAuth} />
        <div className="outer_box">
            <SideBar />
          <div className="task_box">
                <InputTodo />
              <ListTodo />
          </div>
        </div>
      </Fragment>
  );
}

export default TaskPage;