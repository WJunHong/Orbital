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
  Slider,
  Chip,
  CloseIcon,
} from "../../design/table_icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./TaskTables.module.css";
import EditTodo from "../EditTodo";
import FSD from "../FSD";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

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
const TaskTables = ({ name }) => {
  // Array of main tasks
  const [todos, setTodos] = useState([]);

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
      const deadline = todo.deadline;
      const todoDate = todo.tododate;
      const priority = todo.priority;
      const progress = todo.progress;
      const properties = todo.properties;
      const body = {
        description,
        completed,
        deadline,
        todoDate,
        priority,
        progress,
        properties,
      };
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

  const alterDate = async (
    deadline,
    todoDate,
    description,
    priority,
    progress,
    properties,
    id
  ) => {
    try {
      const completed = false;
      console.log(deadline);
      console.log(todoDate);
      const body = {
        description,
        completed,
        deadline,
        todoDate,
        priority,
        progress,
        properties,
      };
      const complete_task = await fetch(`/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err.message);
    }
  };
  //the todo object, para of the operation, val to be passed in
  const updateAll = async (todo, para, val) => {
    try {
      const body = {
        ...todo,
      };
      console.log(val);
      switch (para) {
        case "priority":
          body.priority = val;
          break;
        case "progress":
          body.progress = val;
          break;
        case "completed":
          body.completed = val;
          break;
        case "tododate":
          body.tododate = val;
          var todoDeadlineTime = new Date(body.deadline).getTime();
          var todoDeadline = new Date(todoDeadlineTime - 28800000);
          body.deadline = todoDeadline;
          break;
        case "deadline":
          body.tododate = null;
          body.deadline = val;
          break;
        case "description":
          body.description = val;
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
  const nothing = () => {};
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
            .map((todo) => {
              var todoDeadlineTime = new Date(todo.deadline).getTime();
              var todoDateTime = new Date(todo.tododate).getTime();
              var todoDeadline = new Date(todoDeadlineTime - 28800000);
              var todoDaate = new Date(todoDateTime - 28800000);
              return (
                <>
                  <tr key={todo.todo_id} className="taskData">
                    <td>
                      <div className="checkbox">
                        <CheckBoxOutlineBlankOutlinedIcon
                          onClick={() => updateAll(todo, "completed", true)}
                        />
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
                            maxDate={todoDeadline}
                            minDate={new Date()}
                            disabled={todo.deadline == null}
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
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                          />
                          <DatePicker
                            className="deadlineTime"
                            placeholderText="-"
                            selected={todoDeadline}
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
                  {/* Ex
                  .
                  ..
                  .
                  .
                  .
                  .
                  .
                  panded row*/}

                  <tr key={todo.todo_id * -1} className="expandedTaskData">
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
                      <div className="dropdown1">
                        <ArrowDropDownRoundedIcon
                          className={styles.expandedDropdown}
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
                            selected={todo.tododate == null ? null : todoDaate}
                            onChange={(date) =>
                              updateAll(todo, "tododate", date)
                            }
                            dateFormat="yyyy-MM-dd"
                            maxDate={todoDeadline}
                            minDate={new Date()}
                            disabled={todo.deadline == null}
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
                            dateFormat="yyyy-MM-dd h:mm aa"
                            minDate={new Date()}
                          />
                        </div>
                        <div className="priority1">
                          <FlagRoundedIcon className="priorityIcon1" /> Priority
                          {"  " + todo.priority}
                        </div>
                      </div>
                      <div>
                        <div className="progress_value1">
                          <div>
                            Progress:{" "}
                            <input
                              value={`${todo.progress}`}
                              className={styles.progressInput}
                            />
                            %
                          </div>
                          <ThemeProvider theme={muiTheme1}>
                            <Slider
                              marks={marks}
                              defaultValue={todo.progress}
                              getArialValueText={todo.progress + "%"}
                              className="progressSlider1"
                            />
                          </ThemeProvider>
                        </div>
                      </div>
                    </div>
                    {/* 3rd row */}
                    <div className="expandedTaskData3">
                      <div className="properties1">
                        <div>Properties</div>
                        <input
                          placeholder="Add property"
                          className={styles.inputProperty}
                        />
                        {todo.properties.map((data) => (
                          <Chip
                            label={data}
                            key={data}
                            onDelete={(e) => console.log(e)}
                            size="small"
                            variant="outlined"
                            className={styles.propertyChip}
                            deleteIcon={<CloseIcon className={styles.close} />}
                          />
                        ))}
                      </div>
                      <div className="deleteTask1">
                        <Tooltip title="Delete Task">
                          <DeleteRoundedIcon
                            onClick={() => deleteTodo(todo.todo_id)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </tr>
                </>
              );
            })}
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
            .map((todo) => {
              var todoDeadlineTime = new Date(todo.deadline).getTime();
              var todoDateTime = new Date(todo.tododate).getTime();
              var todoDeadline = new Date(todoDeadlineTime - 28800000);
              var todoDaate = new Date(todoDateTime - 28800000);
              return (
                <tr
                  key={todo.todo_id}
                  className="taskData"
                  onClick={(e) => someFunc(e, todo)}
                >
                  <td>
                    <div className="checkbox">
                      <CheckBoxOutlineBlankOutlinedIcon
                        onClick={() => updateAll(todo, "completed", true)}
                      />
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
                          onChange={(date) => updateAll(todo, "tododate", date)}
                          dateFormat="yyyy-MM-dd"
                          maxDate={todoDeadline}
                          minDate={new Date()}
                          disabled={todo.deadline == null}
                        />
                      </div>
                      <div>
                        <CalendarTodayRoundedIcon fontSize="small" />
                        <DatePicker
                          className="deadlineDate"
                          placeholderText="-"
                          selected={todo.deadline == null ? null : todoDeadline}
                          onChange={(date) => updateAll(todo, "deadline", date)}
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                        />
                        <DatePicker
                          className="deadlineTime"
                          placeholderText="-"
                          selected={todoDeadline}
                          onChange={(date) => updateAll(todo, "deadline", date)}
                          showTimeSelect
                          showTimeSelectOnly
                          dateFormat="h:mm aa"
                          timeCaption="Time"
                        />
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
                todo.deadline != null &&
                todo.deadline.substring(0, 10) !=
                  new Date().toISOString().split("T")[0]
            )
            .map((todo) => {
              var todoDeadlineTime = new Date(todo.deadline).getTime();
              var todoDateTime = new Date(todo.tododate).getTime();
              var todoDeadline = new Date(todoDeadlineTime - 28800000);
              var todoDaate = new Date(todoDateTime - 28800000);
              return (
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
                          onChange={(date) => updateAll(todo, "tododate", date)}
                          dateFormat="yyyy-MM-dd"
                          maxDate={todoDeadline}
                          minDate={new Date()}
                          disabled={todo.deadline == null}
                        />
                      </div>
                      <div className="deadlineBox">
                        <CalendarTodayRoundedIcon fontSize="small" />
                        <DatePicker
                          className="deadlineDate"
                          placeholderText="-"
                          selected={todo.deadline == null ? null : todoDeadline}
                          onChange={(date) => updateAll(todo, "deadline", date)}
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                        />
                        <DatePicker
                          className="deadlineTime"
                          placeholderText="-"
                          selected={todoDeadline}
                          onChange={(date) => updateAll(todo, "deadline", date)}
                          showTimeSelect
                          showTimeSelectOnly
                          dateFormat="h:mm aa"
                          timeCaption="Time"
                        />
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
              );
            })}
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
