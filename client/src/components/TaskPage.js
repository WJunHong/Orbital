import React, { Fragment } from 'react';
import '../App.css';
import "../design/TaskBox.css";

// Components
import InputTodo from "./InputTodo";
import ListTodo from "./ListTodo";
import SideBar from "./SideBar"

const TaskPage = () => {
  return (
      <Fragment>
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