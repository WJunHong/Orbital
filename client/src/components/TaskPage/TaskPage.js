import React, { Fragment } from "react";

import "../../design/TaskBox.css";
import styles from "./TaskPage.module.css";
// Components
import InputTodo from "../InputTodo/InputTodo";
import ListTodo from "../ListTodo";
import Background from "../Background";
import TabName from "../TabName";
import TabBody from "../TabBody";
import TaskTables from "../TaskTables";

// List have 4 definite properties, up to 8 custom properties
const TaskPage = () => {
  return (
    <Background>
      <TabName name={"Main Tasks"} />
      <TabBody>
        <TaskTables name={"mt"} />
        <InputTodo />
      </TabBody>
      <div className={styles.bottom}></div>
    </Background>
  );
};

export default TaskPage;
