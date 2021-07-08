// Imports
import styles from "./Subtasks.module.css";
import React, { Fragment, useState } from "react";
import app from "../../base";
import { TextField } from "../../design/table_icons";

/**
 * A functional component for inputting subtasks
 * @param {object} todo - A main task object.
 * @returns JSX of Input subtask field
 */
const InputSubtasks = ({ todo }) => {
  // Subtask description
  const [description, setDescription] = useState("");
  // main task id linked to group of subtasks
  const task_id = todo.todo_id;

  const submitSubtask = async (e) => {
    // Prevents the page from reloading
    e.preventDefault();
    try {
      // If there is empty input, do not submit!
      if (description === "") {
      } else {
        const user = app.auth().currentUser;
        const user_id = user.uid;
        // Create new object with task_id and description
        const body = { user_id, task_id, description};
        // Send a request to create the new subtask to server
        const response = await fetch("/subtasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        // Reset the input field to empty string after subtask submission
        document.querySelector(`#outlined-subtask-input${todo.todo_id}`).value = "";
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <form className="d-flex mt-5" onSubmit={submitSubtask}>
      <TextField
        id={`outlined-subtask-input${todo.todo_id}`}
        className={styles.inputSubtasks}
        placeholder="Input subtask"
        variant="outlined"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input type="submit" value="Add" className="btn-success btn" />
    </form>
  );
};

export default InputSubtasks;
