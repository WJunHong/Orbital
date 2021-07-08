// Imports
import styles from "./Subtasks.module.css";
import React, { Fragment, useState } from "react";
import app from "../../base";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.warn("Please write something!", {
          position: "top-right",
          autoClose: 1700,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      } else {
        const user = app.auth().currentUser;
        const user_id = user.uid;
        // Create new object with task_id and description
        const body = { user_id, task_id, description };
        // Send a request to create the new subtask to server
        const response = await fetch("/subtasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        // Reset the input field to empty string after subtask submission
        setDescription("");
        toast.success("New Subtask added!", {
          position: "top-right",
          autoClose: 1700,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <>
      <form className={styles.form} onSubmit={submitSubtask}>
        <input
          value={description}
          className={styles.inputSubtasks}
          placeholder="Input new subtask"
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          className={`${styles.addSubtask} btn-success btn`}
        >
          Add
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default InputSubtasks;
