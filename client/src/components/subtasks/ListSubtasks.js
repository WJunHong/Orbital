// Imports
import React, { Fragment, useEffect, useState } from "react";


/**
 * Component that handles listing of subtasks.
 * @param {object} todo - A main task object.
 * @returns JSX of listing of subtasks
 */
const ListSubtasks = ({todo}) => {

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

    const updateSubtask = async (e,id, subtask_id) => {
        try {
            // Calls the UPDATE subtask route method
            e.preventDefault();
            const description = document.querySelector(`#edit_subtask${subtask_id}`).value;
            const submitThis = { description };
            const updateSubtask = await fetch(`/subtasks/${id}/${subtask_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(submitThis)
            });
        } catch (err) {
            console.error(err.message);
        }
    };

    const deleteTodo = async (id, subtask_id) => {
        try {
            // Calls the DELETE subtask route method
            const deleteTodo = await fetch(`/subtasks/${id}/${subtask_id}`, {
                method: "DELETE"
            });
            // Update subtaskList to contain subtasks which have not been deleted
            setSubtaskList(subtaskList.filter(subtask => subtask.subtask_id !== subtask_id));
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
        {" "}
        <table className="table mt-5 text-center">
            <tbody>
                {subtaskList.map(subtask => (
                    <tr key={subtask.subtask_id}>
                        <td>
                            <form onSubmit={e => updateSubtask(e,todo.todo_id, subtask.subtask_id)}>
                                <input type = 'text'
                                id={`edit_subtask${subtask.subtask_id}`}
                                defaultValue={subtask.description}
                                onBlur={() => document.getElementById(`edit_subtask${subtask.subtask_id}`).value = subtask.description}
                                />
                          
                            </form>
                            
                        </td>
                        <td>
                            <button className="btn btn-danger" 
                            onClick={() => deleteTodo(todo.todo_id, subtask.subtask_id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
    </Fragment>);
};

export default ListSubtasks;