import React from "react";

import "../../design/TaskBox.css";
import styles from "./TaskPage.module.css";
// Components
import InputTodo from "../InputTodo/InputTodo";
import Background from "../Background";
import TabName from "../TabName";
import TabBody from "../TabBody";
import TaskTables from "../TaskTables";

const TaskPage = ({ match }) => {
  if (match.path === "/lists/:listName") {
    const {
      params: { listName },
    } = match;
    return (
      <Background>
        <TabName name={listName} />
        <TabBody>
          <TaskTables name={"lists"} listName={listName} />
          <InputTodo listName={listName} />
        </TabBody>
        <div className={styles.bottom}></div>
      </Background>
    );
  } else {
    return (
      <Background>
        <TabName name={"Main Tasks"} />
        <TabBody>
          <TaskTables name={"mt"} listName={"mt"} />
          <InputTodo />
        </TabBody>
        <div className={styles.bottom}></div>
      </Background>
    );
  }
};

export default TaskPage;
