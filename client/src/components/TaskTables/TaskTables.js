import React, { useEffect, useState } from "react";
import app from "../../base";

import {
  CheckBoxOutlineBlankOutlinedIcon,
  AlarmIcon,
  DeleteRoundedIcon,
  CalendarTodayRoundedIcon,
  FlagRoundedIcon,
  CircularProgress,
  ArrowDropDownRoundedIcon,
  Tooltip,
} from "../../design/table_icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./TaskTables.module.css";
import EditTodo from "../EditTodo";
import FSD from "../FSD";

const TaskTables = ({ name }) => {
  // Array of main tasks
  const [todos, setTodos] = useState([]);
  const [startDate, setStartDate] = useState(null);

  const getTodos = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
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
    if (
      e.target.tagName == "TD" ||
      e.target.tagName == "TR" ||
      e.target.className == "deadline"
    ) {
      console.log(todo.description);
    } else {
      console.log(e.target);
    }
  };

  // The fetched filters object
  const filter =
    localStorage.getItem(`filter-${name}`) !== null
      ? JSON.parse(localStorage.getItem(`filter-${name}`))
      : {
          priority: [],
          deadline: [null, null],
          progress: [0, 100],
          todoDate: [null, null],
          properties: [],
        };

  const sortStuff =
    localStorage.getItem(`sort-${name}`) != null
      ? JSON.parse(localStorage.getItem(`sort-${name}`))
      : {
          sort: "dateAdded",
          direction: "descending",
        };

  // <= 0 sort in same order, > 0 sort in reverse order
  const properSort = (task1, task2) => {
    // Sort by descending order
    if (sortStuff.direction == "descending") {
      switch (sortStuff.sort) {
        case "dateAdded":
          return task2.todo_id - task1.todo_id;
          break;
        case "Alphabetical":
          // If 1st is smaller will be negative, no change
          return (
            task2.description[0].toLowerCase().charCodeAt(0) -
            task1.description[0].toLowerCase().charCodeAt(0)
          );
          break;
        case "Priority":
          return task2.priority - task1.priority;
          break;
        case "Deadline":
          if (task1.deadline == null && task2.deadline == null) {
            return 1;
          } else if (task1.deadline == null) {
            return -1;
          } else if (task2.deadline == null) {
            return 1;
          } else {
            // Earlier date before later date
            return (
              new Date(task2.deadline).getTime() -
              new Date(task1.deadline).getTime()
            );
          }
          break;
        case "todoDate":
          if (task1.tododate == null && task2.tododate == null) {
            return 1;
          } else if (task1.tododate == null) {
            return -1;
          } else if (task2.tododate == null) {
            return 1;
          } else {
            // Earlier date before later date
            return (
              new Date(task2.tododate).getTime() -
              new Date(task1.tododate).getTime()
            );
          }
          break;
        default:
          console.log("bad");
          break;
      }
    } else {
      // Sort by ascending order
      switch (sortStuff.sort) {
        case "dateAdded":
          return task1.todo_id - task2.todo_id;
          break;
        case "Alphabetical":
          // If 1st is smaller will be negative, no change
          return (
            task1.description[0].toLowerCase().charCodeAt(0) -
            task2.description[0].toLowerCase().charCodeAt(0)
          );
          break;
        case "Priority":
          return task1.priority - task2.priority;
          break;
        case "Deadline":
          if (task1.deadline == null && task2.deadline == null) {
            return -1;
          } else if (task1.deadline == null) {
            return 1;
          } else if (task2.deadline == null) {
            return -1;
          } else {
            // Earlier date before later date
            return (
              new Date(task1.deadline).getTime() -
              new Date(task2.deadline).getTime()
            );
          }
          break;
        case "todoDate":
          if (task1.tododate == null && task2.tododate == null) {
            return -1;
          } else if (task1.tododate == null) {
            return 1;
          } else if (task2.tododate == null) {
            return -1;
          } else {
            // Earlier date before later date
            return (
              new Date(task1.tododate).getTime() -
              new Date(task2.tododate).getTime()
            );
          }
          break;
        default:
          console.log("bad");
          break;
      }
    }
  };
  const properFilter = (todo) => {
    // console.log(todo.description);
    // console.log(todo.deadline);
    // console.log(filter.todoDate);
    // console.log(todo.priority);
    // console.log(todo.tododate);
    // console.log(todo.progress);
    // console.log(filter);
    // console.log(filter.properties);
    // console.log(filter.deadline);

    var filterMe = true;
    if (filter.properties.length != 0) {
      filterMe =
        filterMe &&
        todo.properties.some((item) => filter.properties.includes(item));
    }
    if (filter.priority.length != 0) {
      filterMe = filterMe && filter.priority.includes(todo.priority);
    }
    if (!filter.deadline.every((i) => i == null) && todo.deadline != null) {
      if (filter.deadline[0] == null) {
        // Filter Start Deadline Empty but End Deadline non-empty

        filterMe =
          filterMe &&
          new Date(todo.deadline).getTime() <=
            new Date(filter.deadline[1]).getTime() + 86400000;
      } else {
        if (filter.deadline[1] == null) {
          // Filter Start Deadline non-empty but End Deadline empty
          filterMe =
            filterMe &&
            new Date(todo.deadline).getTime() >=
              new Date(filter.deadline[0]).getTime();
        } else {
          // Filter Start Deadline non-empty but End Deadline non-empty
          filterMe =
            filterMe &&
            new Date(todo.deadline).getTime() >=
              new Date(filter.deadline[0]).getTime() &&
            new Date(todo.deadline).getTime() <=
              new Date(filter.deadline[1]).getTime() + 86400000;
        }
      }
    } else if (
      !filter.deadline.every((i) => i == null) &&
      todo.deadline == null
    ) {
      filterMe = false;
    }
    if (
      todo.progress < filter.progress[0] ||
      todo.progress > filter.progress[1]
    ) {
      filterMe = false;
    }
    if (!filter.todoDate.every((i) => i == null) && todo.tododate != null) {
      if (filter.todoDate[0] == null) {
        filterMe =
          filterMe &&
          new Date(todo.tododate).getTime() <=
            new Date(filter.todoDate[1]).getTime() + 86400000;
      } else {
        if (filter.todoDate[1] == null) {
          filterMe =
            filterMe &&
            new Date(todo.tododate).getTime() >=
              new Date(filter.todoDate[0]).getTime();
        } else {
          filterMe =
            filterMe &&
            new Date(todo.tododate).getTime() >=
              new Date(filter.todoDate[0]).getTime() &&
            new Date(todo.tododate).getTime() <=
              new Date(filter.todoDate[1]).getTime() + 86400000;
        }
      }
    } else if (
      !filter.todoDate.every((i) => i == null) &&
      todo.todoDate == null
    ) {
      filterMe = false;
    }
    return filterMe;
  };

  const alterDate = (date) => {};
  useEffect(() => {
    getTodos();
  }, [todos]);

  const MainTask = (
    <>
      <FSD name={name} todos={todos} />
      <table className="table task_table todo_table">
        <thead>
          <tr className={styles.topBorder}></tr>
        </thead>
        <tbody>
          {todos
            .sort(properSort)
            .filter(properFilter)
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
                      <DatePicker
                        className="todoDateText"
                        placeholderText="-"
                        selected={
                          todo.tododate == null ? null : new Date(todo.tododate)
                        }
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date(todo.deadline ? todo.deadline : "")}
                      />
                      {/*<span>
                        {todo.tododate == null
                          ? "-"
                          : todo.tododate.substring(0, 10)}
                        </span>*/}
                    </div>
                    <div className="deadlineBox">
                      <CalendarTodayRoundedIcon fontSize="small" />
                      <DatePicker
                        className="deadlineDate"
                        placeholderText="-"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date(todo.deadline)}
                      />
                      {/*<span className="date">
                        {todo.deadline == null
                          ? "-"
                          : todo.deadline.substring(0, 10)}
                        </span>*/}
                      <DatePicker
                        className="deadlineTime"
                        placeholderText="-"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        dateFormat="h:mm aa"
                        timeCaption="Time"
                      />
                      {/*<span className="time">
                        {todo.deadline == null
                          ? "-"
                          : `${todo.deadline.substring(11, 16)}`}
                        </span>*/}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="progress_value">
                    {" "}
                    {todo.progress == 0 ? (
                      <div />
                    ) : (
                      <CircularProgress
                        variant="determinate"
                        value={todo.progress}
                        className="progress"
                        size={24}
                        thickness={8}
                      />
                    )}
                    <div>{`${todo.progress}%`}</div>
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
                todo.deadline != null &&
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
                      <span>
                        {todo.tododate == null
                          ? "-"
                          : todo.tododate.substring(0, 10)}
                      </span>
                    </div>
                    <div>
                      <CalendarTodayRoundedIcon fontSize="small" />

                      <span className="date">
                        {todo.deadline == null
                          ? "-"
                          : todo.deadline.substring(0, 10)}
                      </span>
                      <span className="time">
                        {todo.deadline == null
                          ? "-"
                          : `${todo.deadline.substring(11, 16)}`}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="progress_value">
                    {" "}
                    <CircularProgress
                      variant="determinate"
                      value={todo.progress}
                      className="progress"
                      size={24}
                      thickness={8}
                    />
                    <div>{`${todo.progress}%`}</div>
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
                todo.deadline != null &&
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
                      <span>
                        {todo.tododate == null
                          ? "-"
                          : todo.tododate.substring(0, 10)}
                      </span>
                    </div>
                    <div>
                      <CalendarTodayRoundedIcon fontSize="small" />

                      <span className="date">
                        {todo.deadline == null
                          ? "-"
                          : todo.deadline.substring(0, 10)}
                      </span>
                      <span className="time">
                        {todo.deadline == null
                          ? "-"
                          : `${todo.deadline.substring(11, 16)}`}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="progress_value">
                    {" "}
                    <CircularProgress
                      variant="determinate"
                      value={todo.progress}
                      className="progress"
                      size={24}
                      thickness={8}
                    />
                    <div>{`${todo.progress}%`}</div>
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
