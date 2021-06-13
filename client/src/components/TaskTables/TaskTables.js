import React, { useEffect, useState } from "react";

import {
  CheckBoxOutlineBlankOutlinedIcon,
  AlarmIcon,
  DeleteRoundedIcon,
  CalendarTodayRoundedIcon,
  FlagRoundedIcon,
  CircularProgress,
  ArrowDropDownRoundedIcon,
} from "../../design/table_icons";
import styles from "./TaskTables.module.css";

import EditTodo from "../EditTodo";

const TaskTables = ({ name }) => {
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
      // Calls the GET all tasks route method
      if (name === "mt") {
        const response = await fetch("/todos", {
          method: "GET",
          headers: { user_id },
        });
        const jsonData = await response.json();
        setTodos(jsonData);
      } else {
        const response = await fetch("/filter/todos", {
          method: "GET",
          headers: { user_id },
        });
        const jsonData = await response.json();
        setTodos(jsonData);
      }
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

  const someFunc = (e, todo) => {
    if (e.target.tagName == "TD" || e.target.tagName == "TR") {
      console.log(todo.description);
    }
  };
  useEffect(() => {
    getTodos();
  }, [todos]);

  const MainTask = (
    <table className="table task_table todo_table">
      <tbody>
        {todos.map((todo) => (
          <tr
            key={todo.todo_id}
            className="taskData"
            onClick={(e) => someFunc(e, todo)}
          >
            <td>
              <div className="checkbox">
                <CheckBoxOutlineBlankOutlinedIcon
                  onClick={() => completeTask(todo)}
                />
              </div>
            </td>
            <td className="task_name">
              <div className="description">{todo.description}</div>
              <div className="deadline">
                <div className="todo_date">
                  <AlarmIcon fontSize="small" />
                  <text> Some date</text>
                </div>
                <div>
                  <CalendarTodayRoundedIcon fontSize="small" />

                  <text className="date">11-11-2021</text>
                  <text className="time">06:30 PM</text>
                </div>
              </div>
            </td>
            <td>
              <div className="progress_value">
                {" "}
                <CircularProgress
                  variant="determinate"
                  value={75}
                  className="progress"
                  size={24}
                  thickness={8}
                />
                <div>75%</div>
              </div>
            </td>
            <td>
              <div className="priority">
                <FlagRoundedIcon />
              </div>
            </td>
            <td>
              <EditTodo todo={todo} />
            </td>
            <td>
              <div className="deleteTask">
                <DeleteRoundedIcon onClick={() => deleteTodo(todo.todo_id)} />
              </div>
            </td>
            <td>
              <div className="dropdown">
                <ArrowDropDownRoundedIcon />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const OverviewTasks = (
    <>
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
                onClick={(e) => someFunc(e, todo)}
              >
                <td>
                  <div className="checkbox">
                    <CheckBoxOutlineBlankOutlinedIcon
                      onClick={() => completeTask(todo)}
                    />
                  </div>
                </td>
                <td className="task_name">
                  <div className="description">{todo.description}</div>
                  <div className="deadline">
                    <div className="todo_date">
                      <AlarmIcon fontSize="small" />
                      <text> Some date</text>
                    </div>
                    <div>
                      <CalendarTodayRoundedIcon fontSize="small" />

                      <text className="date">11-11-2021</text>
                      <text className="time">06:30 PM</text>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="progress_value">
                    {" "}
                    <CircularProgress
                      variant="determinate"
                      value={75}
                      className="progress"
                      size={24}
                      thickness={8}
                    />
                    <div>75%</div>
                  </div>
                </td>
                <td>
                  <div className="priority">
                    <FlagRoundedIcon />
                  </div>
                </td>
                <td>
                  <EditTodo todo={todo} />
                </td>
                <td>
                  <div className="deleteTask">
                    <DeleteRoundedIcon
                      onClick={() => deleteTodo(todo.todo_id)}
                    />
                  </div>
                </td>
                <td>
                  <div className="dropdown">
                    <ArrowDropDownRoundedIcon />
                  </div>
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
              <tr
                key={todo.todo_id}
                className="taskData"
                onClick={(e) => someFunc(e)}
              >
                <td>
                  <div className="checkbox">
                    <CheckBoxOutlineBlankOutlinedIcon
                      onClick={() => completeTask(todo)}
                    />
                  </div>
                </td>
                <td className="task_name">
                  <div className="description">{todo.description}</div>
                  <div className="deadline">
                    <div className="todo_date">
                      <AlarmIcon fontSize="small" />
                      <text> Some date</text>
                    </div>
                    <div>
                      <CalendarTodayRoundedIcon fontSize="small" />

                      <text className="date">11-11-2021</text>
                      <text className="time">06:30 PM</text>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="progress_value">
                    {" "}
                    <CircularProgress
                      variant="determinate"
                      value={75}
                      className="progress"
                      size={24}
                      thickness={8}
                    />
                    <div>75%</div>
                  </div>
                </td>
                <td>
                  <div className="priority">
                    <FlagRoundedIcon />
                  </div>
                </td>
                <td>
                  <EditTodo todo={todo} />
                </td>
                <td>
                  <div className="deleteTask">
                    <DeleteRoundedIcon
                      onClick={() => deleteTodo(todo.todo_id)}
                    />
                  </div>
                </td>
                <td>
                  <div className="dropdown">
                    <ArrowDropDownRoundedIcon />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
  if (name === "mt") {
    return MainTask;
  } else {
    return OverviewTasks;
  }
};

export default TaskTables;
