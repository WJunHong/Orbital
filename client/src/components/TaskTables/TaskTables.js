import React, { useEffect, useState } from "react";
import InputSubtasks from "../subtasks/InputSubtasks";
import ListSubtasks from "../subtasks/ListSubtasks";
import app from "../../base";
import Slider from "./SliderComponent"

import {
  CheckBoxOutlineBlankOutlinedIcon,
  AlarmIcon,
  DeleteRoundedIcon,
  CalendarTodayRoundedIcon,
  FlagRoundedIcon,
  CircularProgress,
  ArrowDropDownRoundedIcon,
  Tooltip,
  Chip,
  CloseIcon,
  RemoveCircleOutlineRoundedIcon,
} from "../../design/table_icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./TaskTables.module.css";
import FSD from "../FSD";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const TZOFFSET = 28800000;

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 100,
    label: "100%",
  },
];
const muiTheme1 = createMuiTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: "#0f1425",
      },
      track: {
        color: "white",
      },
      rail: {
        color: "#333333",
      },
      markLabelActive: {
        color: "white",
      },
      markLabel: {
        color: "white",
      },
    },
  },
});
const TaskTables = ({ name, listName }) => {
  // Array of main tasks
  const [todos, setTodos] = useState([]);
  const [progress, setProgress] = useState({});
  const [newProperty, setNewProperty] = useState({});
  const [properties, setProperties] = useState([]);
  const [lists, setLists] = useState([]);

  const getProperties = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all properties route method
      const response = await fetch("/filter/properties", {
        method: "GET",
        headers: { user_id },
      });
      const jsonData = await response.json();
      const { unique_properties } = jsonData;
      if (unique_properties !== null) {
        setProperties(unique_properties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const getTodos = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all tasks route method
      if (listName === "mt" && name === "mt") {
        document.title = "Tickaholic | Main Tasks";
        const response = await fetch("/todos", {
          method: "GET",
          headers: { user_id },
        });
        const jsonData = await response.json();
        setTodos(jsonData);
      } else if (name === "Ov") {
        document.title = "Tickaholic | Overview";
        const response = await fetch("/filter/todos", {
          method: "GET",
          headers: { user_id },
        });
        const jsonData = await response.json();
        setTodos(jsonData);
      } else {
        document.title = `Tickaholic | ${listName}`;
        const response = await fetch(`/todos/${listName}`, {
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
    } catch (err) {
      console.log(err);
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
      toast.error("💀 Task deleted!", {
        position: "top-right",
        autoClose: 1700,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  // The fetched filters object
  const storageName = name + "/" + (listName == null ? "" : listName);
  const filter =
    localStorage.getItem(`filter-${storageName}`) !== null
      ? JSON.parse(localStorage.getItem(`filter-${storageName}`))
      : {
          priority: [],
          deadline: [null, null],
          progress: [0, 100],
          todoDate: [null, null],
          properties: [],
        };

  const sortStuff =
    localStorage.getItem(`sort-${storageName}`) !== null
      ? JSON.parse(localStorage.getItem(`sort-${storageName}`))
      : {
          sort: "dateAdded",
          direction: "descending",
        };

  // <= 0 sort in same order, > 0 sort in reverse order
  const properSort = (task1, task2) => {
    // Sort by descending order
    if (sortStuff.direction === "descending") {
      switch (sortStuff.sort) {
        case "dateAdded":
          return task2.todo_id - task1.todo_id;

        case "Alphabetical":
          // If 1st is smaller will be negative, no change
          return (
            task2.description[0].toLowerCase().charCodeAt(0) -
            task1.description[0].toLowerCase().charCodeAt(0)
          );

        case "Priority":
          return task2.priority - task1.priority;

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

        default:
          console.log("bad");
          break;
      }
    } else {
      // Sort by ascending order
      switch (sortStuff.sort) {
        case "dateAdded":
          return task1.todo_id - task2.todo_id;

        case "Alphabetical":
          // If 1st is smaller will be negative, no change
          return (
            task1.description[0].toLowerCase().charCodeAt(0) -
            task2.description[0].toLowerCase().charCodeAt(0)
          );

        case "Priority":
          return task1.priority - task2.priority;

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

        default:
          console.log("bad");
          break;
      }
    }
  };
  const properFilter = (todo) => {
    const tzOffset = 28800000; // 8 hours in ms
    const day = 86400000; // 1 day in ms
    var filterStartDeadline =
      filter.deadline[0] == null
        ? null
        : new Date(filter.deadline[0]).getTime() + tzOffset;
    var filterEndDeadline =
      filter.deadline[1] == null
        ? null
        : new Date(filter.deadline[1]).getTime() + tzOffset + day;
    var filterStartTododate =
      filter.deadline[0] == null
        ? null
        : new Date(filter.deadline[0]).getTime() + tzOffset + day;
    var filterEndTododate =
      filter.deadline[0] == null
        ? null
        : new Date(filter.deadline[1]).getTime() + tzOffset;
    var todoDeadline =
      todo.deadline == null ? null : new Date(todo.deadline).getTime();
    var todoTodoDate =
      todo.tododate == null ? null : new Date(todo.tododate).getTime();
    var filterMe = true;
    if (filter.properties.length !== 0) {
      filterMe =
        filterMe &&
        todo.properties.some((item) => filter.properties.includes(item));
    }
    if (filter.priority.length !== 0) {
      filterMe = filterMe && filter.priority.includes(todo.priority);
    }
    if (!filter.deadline.every((i) => i == null) && todo.deadline !== null) {
      if (filter.deadline[0] == null) {
        filterMe = filterMe && todoDeadline < filterEndDeadline;
      } else {
        if (filter.deadline[1] == null) {
          filterMe = filterMe && todoDeadline >= filterStartDeadline;
        } else {
          filterMe =
            filterMe &&
            todoDeadline >= filterStartDeadline &&
            todoDeadline < filterEndDeadline;
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
        filterMe = filterMe && todoTodoDate < filterEndTododate;
      } else {
        if (filter.todoDate[1] == null) {
          filterMe = filterMe && todoTodoDate >= filterStartTododate;
        } else {
          filterMe =
            filterMe &&
            todoTodoDate >= filterStartTododate &&
            todoTodoDate < filterEndTododate;
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

  //the todo object, para of the operation, val to be passed in
  const updateAll = async (todo, para, val) => {
    try {
      const body = {
        ...todo,
      };
      if (body.deadline !== null) {
        var deadlineTime = new Date(body.deadline).getTime();
        var deadline = new Date(deadlineTime - TZOFFSET);
        body.deadline = deadline;
      }
      if (body.tododate !== null) {
        var todoDeadlineTime = new Date(body.tododate).getTime();
        var todoDeadline = new Date(todoDeadlineTime - TZOFFSET);
        body.tododate = todoDeadline;
      }
      switch (para) {
        case "priority":
          body.priority = val;
          toast.success("Priority updated!", {
            position: "top-right",
            autoClose: 1700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        case "progress":
          body.progress = val;
          break;
        case "completed":
          body.completed = val;
          toast.success("Yay task completed!!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        case "tododate":
          body.tododate = val;
          toast.success("Todo date updated!", {
            position: "top-right",
            autoClose: 1700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        case "todoenddate":
          body.todoenddate = val;
          toast.success("Todo date updated!", {
            position: "top-right",
            autoClose: 1700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        case "deadline":
          if (
            new Date(body.deadline).getTime() <
            new Date(body.tododate).getTime()
          ) {
            body.tododate = null;
          }
          body.deadline = val;
          toast.success("Deadline updated!", {
            position: "top-right",
            autoClose: 1700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        case "description":
          body.description = val;
          toast.success("Task updated!", {
            position: "top-right",
            autoClose: 1700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        case "properties":
          const number = body.todo_id;
          document.getElementById(`propertyInput${number}`).value = "";
          if (!body.properties.includes(val)) {
            const old = body.properties;
            body.properties = [...old, val];
          }
          toast.success(`Property ${val} added to task!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        case "propertyDelete":
          body.properties = body.properties.filter((i) => i !== val);
          toast.warn(`Property ${val} deleted from task!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        case "addToList":
          console.log(val);
          if (val === "") {
            toast.warn(`Please select a list!`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
          } else {
            body.list = val;
            toast.success(`Successfully moved to ${val}`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
          }
          break;
        case "deleteFromList":
          body.list = "";
          toast.success(`Removed task from list ${listName}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          break;
        default:
          console.log("no match!");
          break;
      }
      const complete_task = await fetch(`/todos/${todo.todo_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err.message);
    }
  };
  const resetDescrip = (e, todo) => {
    e.preventDefault();
    e.target.textContent = todo.description;
  };
  const toggleMe = (val) => {
    document.getElementById(`taskData${val}`).classList.toggle("hidden");
    document
      .getElementById(`expandedTaskData${val}`)
      .classList.toggle("hidden");
  };
  useEffect(() => {
    getTodos();
  }, [todos]);
  useEffect(() => getProperties(), [todos]);
  useEffect(() => {
    getLists();
  }, [lists]);
  const MainTask = (
    <>
      <FSD name={name} todos={todos} listName={listName} />
      <table className="table task_table todo_table">
        <thead>
          <tr className={styles.topBorder}></tr>
        </thead>
        <tbody>
          {todos
            .sort(properSort)
            .filter(properFilter)
            .map((todo) => {
              var todoDeadlineTime = new Date(todo.deadline).getTime();
              var todoDateTime = new Date(todo.tododate).getTime();
              var todoEndDateTime = new Date(todo.todoenddate).getTime();
              var number = todo.todo_id;
              var todoDeadline = new Date(todoDeadlineTime - TZOFFSET);
              var todoDaate = new Date(todoDateTime - TZOFFSET);
              var todoEndDate = new Date(todoEndDateTime - TZOFFSET);
              return (
                <>
                  <tr
                    key={todo.todo_id}
                    className="taskData"
                    id={`taskData${number}`}
                  >
                    <td>
                      <div className="checkbox">
                        <Tooltip title="Complete!">
                          <CheckBoxOutlineBlankOutlinedIcon
                            onClick={() => updateAll(todo, "completed", true)}
                          />
                        </Tooltip>
                      </div>
                    </td>
                    <td className="task_name">
                      <div
                        className={`${styles.taskDescrip}`}
                        contentEditable
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (e.target.textContent === "") {
                              e.target.textContent = todo.description;
                            } else if (
                              e.target.textContent === todo.description
                            ) {
                              // do nothing
                            } else {
                              updateAll(
                                todo,
                                "description",
                                e.target.textContent
                              );

                              e.target.blur();
                            }
                          }
                        }}
                        onBlur={(e) => resetDescrip(e, todo)}
                        suppressContentEditableWarning
                        spellCheck="false"
                      >
                        {todo.description}
                      </div>
                      <div className="deadline">
                        <div className="todo_date">
                          <AlarmIcon fontSize="small" />

                          <DatePicker
                            className="todoDateText"
                            placeholderText="-"
                            selected={todo.tododate == null ? null : todoDaate}
                            onChange={(date) =>
                              updateAll(todo, "tododate", date)
                            }
                            dateFormat="dd-MM-yyyy"
                            maxDate={
                              todo.deadline == null ? null : todoDeadline
                            }
                            minDate={new Date()}
                          />

                          <DatePicker
                            className="deadlineTime"
                            placeholderText="-"
                            selected={
                              todo.tododate == null ? null : todoDaate
                            }
                            onChange={(date) =>
                              updateAll(todo, "tododate", date)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                          />
                        </div>
                        <div className="todo_date">
                          <AlarmIcon fontSize="small" />
                          <DatePicker
                            className="todoDateText"
                            placeholderText="-"
                            selected={todo.todoenddate == null ? null : todoEndDate}
                            onChange={(date) =>
                              updateAll(todo, "todoenddate", date)
                            }
                            dateFormat="dd-MM-yyyy"
                            maxDate={
                              todo.deadline == null ? null : todoDeadline
                            }
                            minDate={new Date()}
                          />

                          <DatePicker
                            className="deadlineTime"
                            placeholderText="-"
                            selected={
                              todo.todoenddate == null ? null : todoEndDate
                            }
                            onChange={(date) =>
                              updateAll(todo, "todoenddate", date)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                          />
                        </div>
                        <div className="deadlineBox">
                          <CalendarTodayRoundedIcon fontSize="small" />

                          <DatePicker
                            className="deadlineDate"
                            placeholderText="-"
                            selected={
                              todo.deadline == null ? null : todoDeadline
                            }
                            onChange={(date) =>
                              updateAll(todo, "deadline", date)
                            }
                            dateFormat="dd-MM-yyyy"
                            minDate={new Date()}
                          />

                          <DatePicker
                            className="deadlineTime"
                            placeholderText="-"
                            selected={
                              todo.deadline == null ? null : todoDeadline
                            }
                            onChange={(date) =>
                              updateAll(todo, "deadline", date)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Tooltip title="Progress">
                        <div className="progress_value">
                          {" "}
                          {todo.progress === 0 ? (
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
                      </Tooltip>
                    </td>
                    <td>
                      <Tooltip title="Priority">
                        <div className="priority">
                          <FlagRoundedIcon
                            style={{
                              color:
                                todo.priority === 1
                                  ? "red"
                                  : todo.priority === 2
                                  ? "rgb(218, 109, 7)"
                                  : todo.priority === 3
                                  ? "rgb(255, 217, 0)"
                                  : todo.priority === 4
                                  ? "rgb(27, 228, 1)"
                                  : "white",
                            }}
                            onClick={() => {
                              updateAll(
                                todo,
                                "priority",
                                (todo.priority % 5) + 1
                              );
                            }}
                          />
                        </div>
                      </Tooltip>
                    </td>
                    <td>
                      <div className="deleteTask">
                        <Tooltip title="Delete Task">
                          <DeleteRoundedIcon
                            onClick={() => deleteTodo(todo.todo_id)}
                          />
                        </Tooltip>
                      </div>
                    </td>
                    <td>
                      <div className="dropdown">
                        <ArrowDropDownRoundedIcon
                          onClick={(e) => toggleMe(number)}
                        />
                      </div>
                    </td>
                  </tr>
                  {/* Ex
                  .
                  ..
                  .
                  .
                  .
                  .
                  .
                  panded row*/}

                  <tr
                    key={todo.todo_id * -1}
                    className="expandedTaskData hidden"
                    id={`expandedTaskData${number}`}
                  >
                    <td>
                      {/* First row */}
                      <div className="expandedTaskData1">
                        {" "}
                        <div className="checkbox1">
                          <Tooltip title="Complete Task">
                            <CheckBoxOutlineBlankOutlinedIcon
                              onClick={() => updateAll(todo, "completed", true)}
                              className={styles.expandedCheck}
                            />
                          </Tooltip>
                        </div>
                        <div
                          className="taskDescrip1"
                          contentEditable
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (e.target.textContent === "") {
                                toast.warn(`Please write something!`, {
                                  position: "top-right",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                  progress: undefined,
                                });
                                e.target.textContent = todo.description;
                              } else if (
                                e.target.textContent === todo.description
                              ) {
                                toast.warn(`Nothing changed bro`, {
                                  position: "top-right",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                  progress: undefined,
                                });
                              } else {
                                updateAll(
                                  todo,
                                  "description",
                                  e.target.textContent
                                );
                                e.target.blur();
                              }
                            }
                          }}
                          onBlur={(e) => resetDescrip(e, todo)}
                          suppressContentEditableWarning
                          spellCheck="false"
                        >
                          {todo.description}
                        </div>
                        <div className="dropdown1">
                          <ArrowDropDownRoundedIcon
                            className={styles.expandedDropdown}
                            onClick={(e) => toggleMe(number)}
                          />
                        </div>
                      </div>
                      {/* second row */}
                      <div className="expandedTaskData2">
                        <div className="leftSide1">
                          <div className="todo_date1">
                            <AlarmIcon
                              fontSize="small"
                              className="todoDateIcon1"
                            />
                            Todo Date:
                            <DatePicker
                              className="todoDateText1"
                              placeholderText="----"
                              selected={
                                todo.tododate == null ? null : todoDaate
                              }
                              showTimeSelect
                              onChange={(date) =>
                                updateAll(todo, "tododate", date)
                              }
                              dateFormat="dd-MM-yyyy h:mm aa"
                              maxDate={
                                todo.deadline == null ? null : todoDeadline
                              }
                              minDate={new Date()}
                            />
                            <DatePicker
                              className="todoDateText1"
                              placeholderText="----"
                              selected={
                                todo.todoenddate == null ? null : todoEndDate
                              }
                              showTimeSelect
                              onChange={(date) =>
                                updateAll(todo, "todoenddate", date)
                              }
                              dateFormat="dd-MM-yyyy h:mm aa"
                              maxDate={
                                todo.deadline == null ? null : todoDeadline
                              }
                              minDate={new Date()}
                            />
                          </div>
                          <div className="deadlineBox1">
                            <CalendarTodayRoundedIcon
                              fontSize="small"
                              className="deadlineIcon1"
                            />
                            Deadline:
                            <DatePicker
                              className="deadlineDate1"
                              placeholderText="----"
                              showTimeSelect
                              selected={
                                todo.deadline == null ? null : todoDeadline
                              }
                              onChange={(date) =>
                                updateAll(todo, "deadline", date)
                              }
                              dateFormat="dd-MM-yyyy h:mm aa"
                              minDate={new Date()}
                            />
                          </div>
                          <div className="priority1">
                            <FlagRoundedIcon
                              className="priorityIcon1"
                              style={{
                                color:
                                  todo.priority === 1
                                    ? "red"
                                    : todo.priority === 2
                                    ? "rgb(218, 109, 7)"
                                    : todo.priority === 3
                                    ? "rgb(255, 217, 0)"
                                    : todo.priority === 4
                                    ? "rgb(27, 228, 1)"
                                    : "white",
                              }}
                              onClick={() => {
                                updateAll(
                                  todo,
                                  "priority",
                                  (todo.priority % 5) + 1
                                );
                              }}
                            />{" "}
                            Priority
                            {"  " + todo.priority}
                          </div>
                        </div>
                        <div>
                          <div className="progress_value1">
                            <div className={styles.progressBox}>
                              Progress:{" "}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const inputValue = document.getElementById(
                                    `progressInput_${todo.todo_id}`
                                  ).value;
                                  if (
                                    isNaN(inputValue) ||
                                    inputValue == "" ||
                                    inputValue < 0 ||
                                    inputValue > 100 
                                  ) {
                                    toast.warn(`Invalid progress input!`, {
                                      position: "top-right",
                                      autoClose: 2000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: false,
                                      draggable: false,
                                      progress: undefined,
                                    });
                                    document.getElementById(
                                    `progressInput_${todo.todo_id}`
                                  ).value = "";
                                  } else {
                                    updateAll(
                                      todo,
                                      "progress",
                                      progress.number
                                    );
                                  }
                                }}
                                className={styles.progressInputForm}
                              >
                                <input
                                  placeholder={todo.progress}
                                  className={styles.progressInput}
                                  id={`progressInput_${todo.todo_id}`}
                                  type="text"
                                  onChange={(e) => {
                                    setProgress({
                                      ...progress,
                                      number: e.target.value,
                                    });
                                  }}
                                />
                              </form>
                              %
                            </div>
                            <ThemeProvider theme={muiTheme1}>
                              <Slider todo={todo} updateAll={updateAll} />
                            </ThemeProvider>
                          </div>
                        </div>
                      </div>
                      {/* 3rd row */}
                      <div className="expandedTaskData3">
                        <div className="properties1">
                          <div>Properties</div>
                          <form
                            id={`propertyAdd${todo.todo_id}`}
                            onSubmit={(e) => {
                              e.preventDefault();
                              updateAll(todo, "properties", newProperty.number);
                            }}
                          >
                            <input
                              autoComplete="off"
                              placeholder="Add property"
                              className={styles.inputProperty}
                              type="text"
                              list={`propertyList${number}`}
                              id={`propertyInput${number}`}
                              name={`propertyAdd${todo.todo_id}`}
                              onChange={(e) =>
                                setNewProperty({
                                      ...newProperty,
                                      number: e.target.value,
                                    })
                              }
                            />
                            <datalist id={`propertyList${number}`}>
                              {properties.map((ppty) => (
                                <option value={ppty} />
                              ))}
                            </datalist>
                          </form>
                          {todo.properties.map((data) => (
                            <Chip
                              label={data}
                              key={data}
                              onDelete={(e) => {
                                e.preventDefault();
                                updateAll(todo, "propertyDelete", data);
                              }}
                              size="small"
                              variant="outlined"
                              className={styles.propertyChip}
                              deleteIcon={
                                <CloseIcon className={styles.close} />
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {/* 4th row */}
                      <div className="expandedTaskData4">
                        <ListSubtasks todo={todo} />
                      </div>
                      {/* 5th row */}
                      <div className="expandedTaskData5">
                        <InputSubtasks todo={todo} />
                      </div>
                      {/* 6th row */}
                      <div className="expandedTaskData6">
                        <div className={styles.moveList}>Move to List</div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            updateAll(
                              todo,
                              "addToList",
                              document.querySelector(".moveList1").value
                            );
                          }}
                        >
                          <select className="moveList1">
                            <option value="">-Select List-</option>
                            {lists
                              .filter((i) =>
                                // If you are in a list, dont include that list in the options
                                name === "lists" ? i !== listName : true
                              )
                              .map((list) => {
                                return <option value={list}>{list}</option>;
                              })}
                          </select>
                          <input
                            type="submit"
                            value="Move"
                            className="moveListSubmit1"
                          />
                        </form>
                      </div>

                      <div className="deleteTask1">
                        {name !== "lists" ? (
                          <div />
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              updateAll(todo, "deleteFromList", listName);
                            }}
                          >
                            <RemoveCircleOutlineRoundedIcon />
                            <input
                              type="submit"
                              value="Delete from list"
                              className="deleteFromList1"
                            />
                          </form>
                        )}

                        <div>
                          Delete Task
                          <DeleteRoundedIcon
                            onClick={() => deleteTodo(todo.todo_id)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>
      <ToastContainer />
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
                todo.deadline !== null &&
                todo.deadline.substring(0, 10) ===
                  new Date().toISOString().split("T")[0]
            )
            .map((todo) => {
              var todoDeadlineTime = new Date(todo.deadline).getTime();
              var todoDateTime = new Date(todo.tododate).getTime();
              var number = todo.todo_id;
              var todoDeadline = new Date(todoDeadlineTime - TZOFFSET);
              var todoDaate = new Date(todoDateTime - TZOFFSET);
              return (
                <>
                  <tr
                    key={todo.todo_id}
                    className="taskData"
                    id={`taskData${number}`}
                  >
                    <td>
                      <div className="checkbox">
                        <Tooltip title="Complete!">
                          <CheckBoxOutlineBlankOutlinedIcon
                            onClick={() => updateAll(todo, "completed", true)}
                          />
                        </Tooltip>
                      </div>
                    </td>
                    <td className="task_name">
                      <div
                        className={`${styles.taskDescrip}`}
                        contentEditable
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (e.target.textContent === "") {
                              e.target.textContent = todo.description;
                            } else if (
                              e.target.textContent === todo.description
                            ) {
                              // do nothing
                            } else {
                              updateAll(
                                todo,
                                "description",
                                e.target.textContent
                              );

                              e.target.blur();
                            }
                          }
                        }}
                        onBlur={(e) => resetDescrip(e, todo)}
                        suppressContentEditableWarning
                        spellCheck="false"
                      >
                        {todo.description}
                      </div>
                      <div className="deadline">
                        <div className="todo_date">
                          <AlarmIcon fontSize="small" />

                          <DatePicker
                            className="todoDateText"
                            placeholderText="-"
                            selected={todo.tododate == null ? null : todoDaate}
                            onChange={(date) =>
                              updateAll(todo, "tododate", date)
                            }
                            dateFormat="dd-MM-yyyy"
                            maxDate={
                              todo.deadline == null ? null : todoDeadline
                            }
                            minDate={new Date()}
                          />
                        </div>
                        <div className="deadlineBox">
                          <CalendarTodayRoundedIcon fontSize="small" />

                          <DatePicker
                            className="deadlineDate"
                            placeholderText="-"
                            selected={
                              todo.deadline == null ? null : todoDeadline
                            }
                            onChange={(date) =>
                              updateAll(todo, "deadline", date)
                            }
                            dateFormat="dd-MM-yyyy"
                            minDate={new Date()}
                          />

                          <DatePicker
                            className="deadlineTime"
                            placeholderText="-"
                            selected={
                              todo.deadline == null ? null : todoDeadline
                            }
                            onChange={(date) =>
                              updateAll(todo, "deadline", date)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Tooltip title="Progress">
                        <div className="progress_value">
                          {" "}
                          {todo.progress === 0 ? (
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
                      </Tooltip>
                    </td>
                    <td>
                      <Tooltip title="Priority">
                        <div className="priority">
                          <FlagRoundedIcon
                            style={{
                              color:
                                todo.priority === 1
                                  ? "red"
                                  : todo.priority === 2
                                  ? "rgb(218, 109, 7)"
                                  : todo.priority === 3
                                  ? "rgb(255, 217, 0)"
                                  : todo.priority === 4
                                  ? "rgb(27, 228, 1)"
                                  : "white",
                            }}
                            onClick={() => {
                              updateAll(
                                todo,
                                "priority",
                                (todo.priority % 5) + 1
                              );
                            }}
                          />
                        </div>
                      </Tooltip>
                    </td>

                    <td>
                      <div className="deleteTask">
                        <Tooltip title="Delete Task">
                          <DeleteRoundedIcon
                            onClick={() => deleteTodo(todo.todo_id)}
                          />
                        </Tooltip>
                      </div>
                    </td>
                    <td>
                      <div className="dropdown">
                        <ArrowDropDownRoundedIcon
                          onClick={(e) => toggleMe(number)}
                        />
                      </div>
                    </td>
                  </tr>
                  {/* Ex
                  .
                  ..
                  .
                  .
                  .
                  .
                  .
                  panded row*/}

                  <tr
                    key={todo.todo_id * -1}
                    className="expandedTaskData hidden"
                    id={`expandedTaskData${number}`}
                  >
                    <td>
                      {/* First row */}
                      <div className="expandedTaskData1">
                        {" "}
                        <div className="checkbox1">
                          <Tooltip title="Complete Task">
                            <CheckBoxOutlineBlankOutlinedIcon
                              onClick={() => updateAll(todo, "completed", true)}
                              className={styles.expandedCheck}
                            />
                          </Tooltip>
                        </div>
                        <div
                          className="taskDescrip1"
                          contentEditable
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (e.target.textContent === "") {
                                toast.warn(`Please write something!`, {
                                  position: "top-right",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                  progress: undefined,
                                });
                                e.target.textContent = todo.description;
                              } else if (
                                e.target.textContent === todo.description
                              ) {
                                toast.warn(`Nothing changed bro`, {
                                  position: "top-right",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                  progress: undefined,
                                });
                              } else {
                                updateAll(
                                  todo,
                                  "description",
                                  e.target.textContent
                                );

                                e.target.blur();
                              }
                            }
                          }}
                          onBlur={(e) => resetDescrip(e, todo)}
                          suppressContentEditableWarning
                          spellCheck="false"
                        >
                          {todo.description}
                        </div>
                        <div className="dropdown1">
                          <ArrowDropDownRoundedIcon
                            className={styles.expandedDropdown}
                            onClick={(e) => toggleMe(number)}
                          />
                        </div>
                      </div>
                      {/* second row */}
                      <div className="expandedTaskData2">
                        <div className="leftSide1">
                          <div className="todo_date1">
                            <AlarmIcon
                              fontSize="small"
                              className="todoDateIcon1"
                            />
                            Todo Date:
                            <DatePicker
                              className="todoDateText1"
                              placeholderText="----"
                              selected={
                                todo.tododate == null ? null : todoDaate
                              }
                              onChange={(date) =>
                                updateAll(todo, "tododate", date)
                              }
                              dateFormat="dd-MM-yyyy"
                              maxDate={
                                todo.deadline == null ? null : todoDeadline
                              }
                              minDate={new Date()}
                            />
                          </div>
                          <div className="deadlineBox1">
                            <CalendarTodayRoundedIcon
                              fontSize="small"
                              className="deadlineIcon1"
                            />
                            Deadline:
                            <DatePicker
                              className="deadlineDate1"
                              placeholderText="----"
                              showTimeSelect
                              selected={
                                todo.deadline == null ? null : todoDeadline
                              }
                              onChange={(date) =>
                                updateAll(todo, "deadline", date)
                              }
                              dateFormat="dd-MM-yyyy h:mm aa"
                              minDate={new Date()}
                            />
                          </div>
                          <div className="priority1">
                            <FlagRoundedIcon
                              className="priorityIcon1"
                              style={{
                                color:
                                  todo.priority === 1
                                    ? "red"
                                    : todo.priority === 2
                                    ? "rgb(218, 109, 7)"
                                    : todo.priority === 3
                                    ? "rgb(255, 217, 0)"
                                    : todo.priority === 4
                                    ? "rgb(27, 228, 1)"
                                    : "white",
                              }}
                              onClick={() => {
                                updateAll(
                                  todo,
                                  "priority",
                                  (todo.priority % 5) + 1
                                );
                              }}
                            />{" "}
                            Priority
                            {"  " + todo.priority}
                          </div>
                        </div>
                        <div>
                          <div className="progress_value1">
                            <div className={styles.progressBox}>
                              Progress:{" "}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const inputValue = document.getElementById(
                                    `progressInput_${todo.todo_id}`
                                  ).value;
                                  if (
                                    isNaN(inputValue) ||
                                    inputValue == "" ||
                                    inputValue < 0 ||
                                    inputValue > 100
                                  ) {
                                    toast.warn(`Invalid progress input!`, {
                                      position: "top-right",
                                      autoClose: 2000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: false,
                                      draggable: false,
                                      progress: undefined,
                                    });
                                    document.getElementById(
                                    `progressInput_${todo.todo_id}`
                                  ).value = "";
                                  } else {
                                    updateAll(
                                      todo,
                                      "progress",
                                      progress.number
                                    );
                                  }
                                }}
                                className={styles.progressInputForm}
                              >
                                <input
                                  placeholder={todo.progress}
                                  className={styles.progressInput}
                                  id={`progressInput_${todo.todo_id}`}
                                  type="text"
                                  onChange={(e) => {
                                    setProgress({
                                      ...progress,
                                      number: e.target.value,
                                    });
                                  }}
                                />
                              </form>
                              %
                            </div>
                            <ThemeProvider theme={muiTheme1}>
                              <Slider todo={todo} updateAll={updateAll} className="progressSlider1" />
                            </ThemeProvider>
                          </div>
                        </div>
                      </div>
                      {/* 3rd row */}
                      <div className="expandedTaskData3">
                        <div className="properties1">
                          <div>Properties</div>
                          <form
                            id={`propertyAdd${todo.todo_id}`}
                            onSubmit={(e) => {
                              e.preventDefault();
                              updateAll(todo, "properties", newProperty.number);
                            }}
                          >
                            <input
                              autoComplete="off"
                              placeholder="Add property"
                              className={styles.inputProperty}
                              type="text"
                              list={`propertyList${number}`}
                              id={`propertyInput${number}`}
                              name={`propertyAdd${todo.todo_id}`}
                              onChange={(e) =>
                                setNewProperty({
                                  ...newProperty,
                                  number: e.target.value,
                                })
                              }
                            />
                            <datalist id={`propertyList${number}`}>
                              {properties.map((ppty) => (
                                <option value={ppty} />
                              ))}
                            </datalist>
                          </form>
                          {todo.properties.map((data) => (
                            <Chip
                              label={data}
                              key={data}
                              onDelete={(e) => {
                                e.preventDefault();
                                updateAll(todo, "propertyDelete", data);
                              }}
                              size="small"
                              variant="outlined"
                              className={styles.propertyChip}
                              deleteIcon={
                                <CloseIcon className={styles.close} />
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {/* 4th row */}
                      <div className="expandedTaskData4">
                        <ListSubtasks todo={todo} />
                      </div>
                      {/* 5th row */}
                      <div className="expandedTaskData5">
                        <InputSubtasks todo={todo} />
                      </div>
                      {/* 6th row */}
                      <div className="expandedTaskData6">
                        <div className={styles.moveList}>Move to List</div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            updateAll(
                              todo,
                              "addToList",
                              document.querySelector(".moveList1").value
                            );
                          }}
                        >
                          <select className="moveList1">
                            <option value="">-Select List-</option>
                            {lists
                              .filter((i) =>
                                // If you are in a list, dont include that list in the options
                                name === "lists" ? i !== listName : true
                              )
                              .map((list) => {
                                return <option value={list}>{list}</option>;
                              })}
                          </select>
                          <input
                            type="submit"
                            value="Move"
                            className="moveListSubmit1"
                          />
                        </form>
                      </div>

                      <div className="deleteTask1">
                        {name !== "lists" ? (
                          <div />
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              updateAll(todo, "deleteFromList", listName);
                            }}
                          >
                            <RemoveCircleOutlineRoundedIcon />
                            <input
                              type="submit"
                              value="Delete from list"
                              className="deleteFromList1"
                            />
                          </form>
                        )}

                        <div>
                          Delete Task
                          <DeleteRoundedIcon
                            onClick={() => deleteTodo(todo.todo_id)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
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
                todo.deadline !== null &&
                todo.deadline.substring(0, 10) !==
                  new Date().toISOString().split("T")[0]
            )
            .map((todo) => {
              var todoDeadlineTime = new Date(todo.deadline).getTime();
              var todoDateTime = new Date(todo.tododate).getTime();
              var number = todo.todo_id;
              var todoDeadline = new Date(todoDeadlineTime - TZOFFSET);
              var todoDaate = new Date(todoDateTime - TZOFFSET);
              return (
                <>
                  <tr
                    key={todo.todo_id}
                    className="taskData"
                    id={`taskData${number}`}
                  >
                    <td>
                      <div className="checkbox">
                        <Tooltip title="Complete!">
                          <CheckBoxOutlineBlankOutlinedIcon
                            onClick={() => updateAll(todo, "completed", true)}
                          />
                        </Tooltip>
                      </div>
                    </td>
                    <td className="task_name">
                      <div
                        className={`${styles.taskDescrip}`}
                        contentEditable
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (e.target.textContent === "") {
                              e.target.textContent = todo.description;
                            } else if (
                              e.target.textContent === todo.description
                            ) {
                              // do nothing
                            } else {
                              updateAll(
                                todo,
                                "description",
                                e.target.textContent
                              );

                              e.target.blur();
                            }
                          }
                        }}
                        onBlur={(e) => resetDescrip(e, todo)}
                        suppressContentEditableWarning
                        spellCheck="false"
                      >
                        {todo.description}
                      </div>
                      <div className="deadline">
                        <div className="todo_date">
                          <AlarmIcon fontSize="small" />

                          <DatePicker
                            className="todoDateText"
                            placeholderText="-"
                            selected={todo.tododate == null ? null : todoDaate}
                            onChange={(date) =>
                              updateAll(todo, "tododate", date)
                            }
                            dateFormat="yyyy-MM-dd"
                            maxDate={
                              todo.deadline == null ? null : todoDeadline
                            }
                            minDate={new Date()}
                          />
                        </div>
                        <div className="deadlineBox">
                          <CalendarTodayRoundedIcon fontSize="small" />

                          <DatePicker
                            className="deadlineDate"
                            placeholderText="-"
                            selected={
                              todo.deadline == null ? null : todoDeadline
                            }
                            onChange={(date) =>
                              updateAll(todo, "deadline", date)
                            }
                            dateFormat="dd-MM-yyyy"
                            minDate={new Date()}
                          />

                          <DatePicker
                            className="deadlineTime"
                            placeholderText="-"
                            selected={
                              todo.deadline == null ? null : todoDeadline
                            }
                            onChange={(date) =>
                              updateAll(todo, "deadline", date)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Tooltip title="Progress">
                        <div className="progress_value">
                          {" "}
                          {todo.progress === 0 ? (
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
                      </Tooltip>
                    </td>
                    <td>
                      <Tooltip title="Priority">
                        <div className="priority">
                          <FlagRoundedIcon
                            style={{
                              color:
                                todo.priority === 1
                                  ? "red"
                                  : todo.priority === 2
                                  ? "rgb(218, 109, 7)"
                                  : todo.priority === 3
                                  ? "rgb(255, 217, 0)"
                                  : todo.priority === 4
                                  ? "rgb(27, 228, 1)"
                                  : "white",
                            }}
                            onClick={() => {
                              updateAll(
                                todo,
                                "priority",
                                (todo.priority % 5) + 1
                              );
                            }}
                          />
                        </div>
                      </Tooltip>
                    </td>

                    <td>
                      <div className="deleteTask">
                        <Tooltip title="Delete Task">
                          <DeleteRoundedIcon
                            onClick={() => deleteTodo(todo.todo_id)}
                          />
                        </Tooltip>
                      </div>
                    </td>
                    <td>
                      <div className="dropdown">
                        <ArrowDropDownRoundedIcon
                          onClick={(e) => toggleMe(number)}
                        />
                      </div>
                    </td>
                  </tr>
                  {/* Ex
                  .
                  ..
                  .
                  .
                  .
                  .
                  .
                  panded row*/}

                  <tr
                    key={todo.todo_id * -1}
                    className="expandedTaskData hidden"
                    id={`expandedTaskData${number}`}
                  >
                    <td>
                      {/* First row */}
                      <div className="expandedTaskData1">
                        {" "}
                        <div className="checkbox1">
                          <Tooltip title="Complete Task">
                            <CheckBoxOutlineBlankOutlinedIcon
                              onClick={() => updateAll(todo, "completed", true)}
                              className={styles.expandedCheck}
                            />
                          </Tooltip>
                        </div>
                        <div
                          className="taskDescrip1"
                          contentEditable
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (e.target.textContent === "") {
                                toast.warn(`Please write something!`, {
                                  position: "top-right",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                  progress: undefined,
                                });
                                e.target.textContent = todo.description;
                              } else if (
                                e.target.textContent === todo.description
                              ) {
                                toast.warn(`Nothing changed bro`, {
                                  position: "top-right",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                  progress: undefined,
                                });
                              } else {
                                updateAll(
                                  todo,
                                  "description",
                                  e.target.textContent
                                );

                                e.target.blur();
                              }
                            }
                          }}
                          onBlur={(e) => resetDescrip(e, todo)}
                          suppressContentEditableWarning
                          spellCheck="false"
                        >
                          {todo.description}
                        </div>
                        <div className="dropdown1">
                          <ArrowDropDownRoundedIcon
                            className={styles.expandedDropdown}
                            onClick={(e) => toggleMe(number)}
                          />
                        </div>
                      </div>
                      {/* second row */}
                      <div className="expandedTaskData2">
                        <div className="leftSide1">
                          <div className="todo_date1">
                            <AlarmIcon
                              fontSize="small"
                              className="todoDateIcon1"
                            />
                            Todo Date:
                            <DatePicker
                              className="todoDateText1"
                              placeholderText="----"
                              selected={
                                todo.tododate == null ? null : todoDaate
                              }
                              onChange={(date) =>
                                updateAll(todo, "tododate", date)
                              }
                              dateFormat="dd-MM-yyyy"
                              maxDate={
                                todo.deadline == null ? null : todoDeadline
                              }
                              minDate={new Date()}
                            />
                          </div>
                          <div className="deadlineBox1">
                            <CalendarTodayRoundedIcon
                              fontSize="small"
                              className="deadlineIcon1"
                            />
                            Deadline:
                            <DatePicker
                              className="deadlineDate1"
                              placeholderText="----"
                              showTimeSelect
                              selected={
                                todo.deadline == null ? null : todoDeadline
                              }
                              onChange={(date) =>
                                updateAll(todo, "deadline", date)
                              }
                              dateFormat="dd-MM-yyyy h:mm aa"
                              minDate={new Date()}
                            />
                          </div>
                          <div className="priority1">
                            <FlagRoundedIcon
                              className="priorityIcon1"
                              style={{
                                color:
                                  todo.priority === 1
                                    ? "red"
                                    : todo.priority === 2
                                    ? "rgb(218, 109, 7)"
                                    : todo.priority === 3
                                    ? "rgb(255, 217, 0)"
                                    : todo.priority === 4
                                    ? "rgb(27, 228, 1)"
                                    : "white",
                              }}
                              onClick={() => {
                                updateAll(
                                  todo,
                                  "priority",
                                  (todo.priority % 5) + 1
                                );
                              }}
                            />{" "}
                            Priority
                            {"  " + todo.priority}
                          </div>
                        </div>
                        <div>
                          <div className="progress_value1">
                            <div className={styles.progressBox}>
                              Progress:{" "}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (
                                    document.getElementById(
                                      `progressInput_${todo.todo_id}`
                                    ).value === ""
                                  ) {
                                    console.log(1);
                                  } else {
                                    updateAll(
                                      todo,
                                      "progress",
                                      progress.number
                                    );
                                  }
                                }}
                                className={styles.progressInputForm}
                              >
                                <input
                                  placeholder={todo.progress}
                                  className={styles.progressInput}
                                  id={`progressInput_${todo.todo_id}`}
                                  type="text"
                                  min={0}
                                  max={100}
                                  onChange={(e) => {
                                    setProgress({
                                      ...progress,
                                      number: e.target.value,
                                    });
                                  }}
                                />
                              </form>
                              %
                            </div>
                            <ThemeProvider theme={muiTheme1}>
                              <Slider todo={todo} updateAll={updateAll} className="progressSlider1" />
                            </ThemeProvider>
                          </div>
                        </div>
                      </div>
                      {/* 3rd row */}
                      <div className="expandedTaskData3">
                        <div className="properties1">
                          <div>Properties</div>
                          <form
                            id={`propertyAdd${todo.todo_id}`}
                            onSubmit={(e) => {
                              e.preventDefault();
                              updateAll(todo, "properties", newProperty.number);
                            }}
                          >
                            <input
                              autoComplete="off"
                              placeholder="Add property"
                              className={styles.inputProperty}
                              type="text"
                              list={`propertyList${number}`}
                              id={`propertyInput${number}`}
                              name={`propertyAdd${todo.todo_id}`}
                              onChange={(e) =>
                                setNewProperty({
                                  ...newProperty,
                                  number: e.target.value,
                                })
                              }
                            />
                            <datalist id={`propertyList${number}`}>
                              {properties.map((ppty) => (
                                <option value={ppty} />
                              ))}
                            </datalist>
                          </form>
                          {todo.properties.map((data) => (
                            <Chip
                              label={data}
                              key={data}
                              onDelete={(e) => {
                                e.preventDefault();
                                updateAll(todo, "propertyDelete", data);
                              }}
                              size="small"
                              variant="outlined"
                              className={styles.propertyChip}
                              deleteIcon={
                                <CloseIcon className={styles.close} />
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {/* 4th row */}
                      <div className="expandedTaskData4">
                        <ListSubtasks todo={todo} />
                      </div>
                      {/* 5th row */}
                      <div className="expandedTaskData5">
                        <InputSubtasks todo={todo} />
                      </div>
                      {/* 6th row */}
                      <div className="expandedTaskData6">
                        <div className={styles.moveList}>Move to List</div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            updateAll(
                              todo,
                              "addToList",
                              document.querySelector(".moveList1").value
                            );
                          }}
                        >
                          <select className="moveList1">
                            <option value="">-Select List-</option>
                            {lists
                              .filter((i) =>
                                // If you are in a list, dont include that list in the options
                                name === "lists" ? i !== listName : true
                              )
                              .map((list) => {
                                return <option value={list}>{list}</option>;
                              })}
                          </select>
                          <input
                            type="submit"
                            value="Move"
                            className="moveListSubmit1"
                          />
                        </form>
                      </div>

                      <div className="deleteTask1">
                        {name !== "lists" ? (
                          <div />
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              updateAll(todo, "deleteFromList", listName);
                            }}
                          >
                            <RemoveCircleOutlineRoundedIcon />
                            <input
                              type="submit"
                              value="Delete from list"
                              className="deleteFromList1"
                            />
                          </form>
                        )}

                        <div>
                          Delete Task
                          <DeleteRoundedIcon
                            onClick={() => deleteTodo(todo.todo_id)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>
      <ToastContainer />
    </>
  );
  if (name === "Ov") {
    return OverviewTasks;
  } else {
    return MainTask;
  }
};

export default TaskTables;
