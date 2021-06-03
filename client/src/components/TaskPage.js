import React, { Fragment, useState } from 'react';
import '../App.css';

// Components
import TaskBox from "./components/TaskBox";
import Heading from "./components/Heading";

const TaskPage = () => {
  return (
      <Fragment>
        <Heading />
        <TaskBox />
      </Fragment>
  );
}

export default TaskPage;