import React, { useEffect, useState } from "react";
import "../../design/TaskBox.css";
import styles from "./TaskPage.module.css";
// Components
import InputTodo from "../InputTodo/InputTodo";
import Background from "../Background";
import TabName from "../TabName";
import TabBody from "../TabBody";
import TaskTables from "../TaskTables";
import app from "../../base";
import Loading from "../../Loading.js";

/**
 * the main task page or a list page.
 */
const TaskPage = ({ match }) => {
  const [lists, setLists] = useState([]);
  const [pending, setPending] = useState(true);

  const getLists = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      const response = await fetch("/todos/lists", {
        method: "GET",
        headers: { user_id },
      });

      const jsonData = await response.json();
      if (jsonData !== null) {
        setLists(jsonData);
      }
      setPending(false);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getLists();
  }, []);

  if (pending) {
    return <Loading loading={pending} />;
  }

  if (match.path === "/lists/:listName") {
    const {
      params: { listName },
    } = match;
    if (lists.includes(listName)) { 
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
      window.location="/taskpage"
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
