// Imports
import React from 'react';

import InputTodo from "./InputTodo";
import ListTodo from "./ListTodo";
import SideBar from "./SideBar";
import "../design/TaskBox.css";

/**
 * A functional component representing where tasks are displayed
 * @returns JSX of taskbox component
 */
const TaskBox = () => {
    return (
        <div className="outer_box">
            <SideBar />
        <div className="task_box">
            <InputTodo />
            <ListTodo />
        </div>
        </div>
    );
};

export default TaskBox;