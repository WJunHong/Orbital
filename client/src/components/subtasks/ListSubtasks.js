// Imports
import React, { Fragment, useEffect, useState } from "react";
import styles from "./Subtasks.module.css";
import { DeleteOutlineRoundedIcon, Tooltip } from "../../design/table_icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Component that handles listing of subtasks.
 * @param {object} todo - A main task object.
 * @returns JSX of listing of subtasks
 */
const ListSubtasks = ({ todo }) => {
  // List of subtasks pertaining to todo
  const [subtaskList, setSubtaskList] = useState([]);

  const getSubtasks = async (id) => {
    try {
      // Calls the GET all subtasks route method
      const response = await fetch(`/subtasks/${id}`);
      const jsonData = await response.json();
      setSubtaskList(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateSubtask = async (e, id, subtask_id) => {
    try {
      // Calls the UPDATE subtask route method
      e.preventDefault();
      const description = document.querySelector(
        `#edit_subtask${subtask_id}`
      ).value;
      if (description === "") {
        // do nothing
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
        const submitThis = { description };
        const updateSubtask = await fetch(`/subtasks/${id}/${subtask_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitThis),
        });
        toast.success("Subtask updated!", {
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

  const deleteSubtask = async (id, subtask_id) => {
    try {
      // Calls the DELETE subtask route method
      const deleteTodo = await fetch(`/subtasks/${id}/${subtask_id}`, {
        method: "DELETE",
      });
      // Update subtaskList to contain subtasks which have not been deleted
      setSubtaskList(
        subtaskList.filter((subtask) => subtask.subtask_id !== subtask_id)
      );
      toast.error("Subtask Deleted!", {
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

  // Updates once subtasklist is changed
  useEffect(() => {
    getSubtasks(todo.todo_id);
  }, [subtaskList]);

  return (
    <Fragment>
      <div clas></div>
      <table className={styles.table}>
        <thead className={styles.subtasksHeader}>Subtasks</thead>
        <tbody>
          {subtaskList.map((subtask) => (
            <tr key={subtask.subtask_id}>
              <td>
                <form
                  onSubmit={(e) =>
                    updateSubtask(e, todo.todo_id, subtask.subtask_id)
                  }
                >
                  <input
                    className={styles.editSubtasks}
                    type="text"
                    id={`edit_subtask${subtask.subtask_id}`}
                    defaultValue={subtask.description}
                    onBlur={() =>
                      (document.getElementById(
                        `edit_subtask${subtask.subtask_id}`
                      ).value = subtask.description)
                    }
                  />
                </form>
              </td>
              <td>
                <Tooltip title="Delete Subtask" placement="right">
                  <DeleteOutlineRoundedIcon
                    className={styles.deleteSubtask}
                    onClick={() =>
                      deleteSubtask(todo.todo_id, subtask.subtask_id)
                    }
                  />
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </Fragment>
  );
};

export default ListSubtasks;
