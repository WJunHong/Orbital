// Imports
import React, { Fragment, useEffect, useState } from "react";
// Style imports
import styles from "./Subtasks.module.css";
import {
  DeleteOutlineRoundedIcon,
  Tooltip,
  CheckBoxOutlineBlankOutlinedIcon,
} from "../../design/table_icons";
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
  /**
   * Function 1: Gets all subtasks related to the user.
   * @param {String} id The id of the user.
   */
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
  /**
   * Function 2: Updates the subtasks of the user via some action (edit description or completion).
   * @param {Object} e The event object of form submission.
   * @param {String} id The id of the user.
   * @param {int} subtask_id The id of subtask to be altered.
   * @param {boolean} completed The completion status of the task.
   */
  const updateSubtask = async (e, id, subtask_id, completed) => {
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
        const submitThis = { description, completed };
        const updateSubtask = await fetch(`/subtasks/${id}/${subtask_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitThis),
        });
        if (completed) {
          toast.success("Yay subtask completed!!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        } else {
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
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  /**
   * Function 3: Deletes a subtask.
   * @param {String} id The id of the user.
   * @param {int} subtask_id The id of the subtask.
   */
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
          {subtaskList
            .filter((subtask) => !subtask.completed)
            .map((subtask) => (
              <tr key={subtask.subtask_id}>
                <td>
                  <div className="checkbox1">
                    <Tooltip title="Complete subtask">
                      <CheckBoxOutlineBlankOutlinedIcon
                        onClick={(e) =>
                          updateSubtask(
                            e,
                            todo.todo_id,
                            subtask.subtask_id,
                            true
                          )
                        }
                        className={styles.expandedCheck}
                      />
                    </Tooltip>
                  </div>
                </td>
                <td>
                  <form
                    onSubmit={(e) =>
                      updateSubtask(e, todo.todo_id, subtask.subtask_id, false)
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
