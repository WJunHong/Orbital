import React, { Fragment, useState, useEffect } from "react";

//style imports
import { Paper } from "@material-ui/core";
import styles from "./Overview.module.css";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import TimerOutlinedIcon from "@material-ui/icons/TimerOutlined";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import "../../design/TaskBox.css";
// Pop up
import EditTodo from "../EditTodo";

const Overview = () => {
  // Array of main tasks
  const [todos, setTodos] = useState([]);

  const getUserId = async () => {
    const res = await fetch("http://localhost:5000/", {
      method: "GET",
      headers: { token: localStorage.token },
    });

    const parseData = await res.json();
    return parseData[1].user_id;
  };

  const getTodos = async () => {
    try {
      const user_id = await getUserId();
      // Calls the GET all tasks within a week route method
      const response = await fetch("/filter/todos", {
        method: "GET",
        headers: { user_id },
      });
      const jsonData = await response.json();
      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      // Calls the DELETE task route method
      const deleteTodo = await fetch(`/todos/${id}`, {
        method: "DELETE",
      });

      // Sets the array of main tasks to exclude the newly deleted task
      setTodos(todos.filter((todo) => todo.todo_id !== id));

      // Calls the DELETE subtasks route method
      const deleteSubtasks = await fetch(`/subtasks/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const completeTask = async (todo) => {
    try {
      const description = todo.description;
      const completed = true;
      const body = { description, completed };
      const comeplete_task = await fetch(`/todos/${todo.todo_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err.message);
    }
  };
  const someFunc = (e) => {
    window.alert("Something");
  };
  // Updates whenever main tasks list changes
  useEffect(() => {
    getTodos();
  }, [todos]);
  // Future -> Overview highlighted when on the page
  return (
    <Fragment>
      <div className={styles.mainBody}>
        <Paper elevation={2} className={styles.overviewName}>
          Overview
        </Paper>
        <Paper elevation={2} className={styles.overviewBox}>
          <table className="table task_table todo_table">
            <thead>
              <tr>
                <th colspan="4">Today</th>
              </tr>
            </thead>
            <tbody>
              {todos
                .filter(
                  (todo) =>
                    todo.deadline.substring(0, 10) ===
                    new Date().toISOString().split("T")[0]
                )
                .map((todo) => (
                  <tr
                    key={todo.todo_id}
                    className="taskData"
                    onClick={(e) => someFunc(e)}
                  >
                    <td>
                      <CheckBoxOutlineBlankOutlinedIcon
                        className="checkbox"
                        onClick={() => completeTask(todo)}
                      />
                    </td>
                    <td className="task_name">{todo.description}</td>
                    <td>
                      <TimerOutlinedIcon className="priority" />
                    </td>
                    <td>
                      <EditTodo todo={todo} />
                    </td>
                    <td>
                      <DeleteRoundedIcon
                        className="deleteTask"
                        onClick={() => deleteTodo(todo.todo_id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <table className="table task_table todo_table">
            <thead>
              <tr>
                <th colspan="4">Upcoming</th>
              </tr>
            </thead>
            <tbody>
              {todos
                .filter(
                  (todo) =>
                    todo.deadline.substring(0, 10) !=
                    new Date().toISOString().split("T")[0]
                )
                .map((todo) => (
                  <tr key={todo.todo_id} className="taskData">
                    <td>
                      <CheckBoxOutlineBlankOutlinedIcon
                        className="checkbox"
                        onClick={() => completeTask(todo)}
                      />
                    </td>
                    <td className="task_name">{todo.description}</td>
                    <td>
                      <EditTodo todo={todo} />
                    </td>
                    <td>
                      <DeleteRoundedIcon
                        onClick={() => deleteTodo(todo.todo_id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Paper>
      </div>
    </Fragment>
  );
};

export default Overview;

/*







*/
