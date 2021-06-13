// Imports
import React, { Fragment, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import styles from "./InputTodo.module.css";

/**
 * A functional component representing the input of a task
 * @returns JSX of input field and add button
 */
const InputToDo = () => {
  // Description of a task
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    // Prevents page from reloading on form submission
    e.preventDefault();
    try {
      if (description === "") {
        // If task field is empty, do not submit anything
      } else {
        // Fetches user_id
        const res = await fetch("http://localhost:5000/", {
          method: "GET",
          headers: { token: localStorage.token },
        });

        const parseData = await res.json();
        const user_id = parseData[1].user_id;
        console.log(user_id);

        // Sends a request to create the new task in server
        const body = { user_id, description };
        const response = await fetch("/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        // Reset the input field to empty upon successful task submission
        document.querySelector(".add_task").value = "";
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <div className={styles.addTask}>
        <Fab aria-label="add" className={styles.addButton} size="medium">
          <AddIcon />
        </Fab>
        <form
          className={`${styles.addTaskMenu} d-flex`}
          onSubmit={onSubmitForm}
        >
          <input
            type="text"
            className="form-control add_task"
            placeholder="Input task"
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
          />

          <button className="btn btn-success add_button"> Add</button>
        </form>
      </div>
    </Fragment>
  );
};

export default InputToDo;
