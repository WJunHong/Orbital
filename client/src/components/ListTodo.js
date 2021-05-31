// Imports
import React, { Fragment, useEffect, useState } from "react";

import EditTodo from "./EditTodo";

/**
 * A functional component representing a list of main tasks
 * @returns JSX of main tasks list
 */
const ListTodo = () => {
    
    // Array of main tasks
    const [todos, setTodos] = useState([]);
    
    const getTodos = async() => {
        try {
            // Calls the GET all tasks route method
            const response = await fetch("/todos");
            const jsonData = await response.json();
            setTodos(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };
    
    const deleteTodo = async (id) => {
        try {
            // Calls the DELETE task route method
            const deleteTodo = await fetch(`/todos/${id}`, {
                method: "DELETE"
            });

            // Sets the array of main tasks to exclude the newly deleted task
            setTodos(todos.filter(todo => todo.todo_id !== id));

            // Calls the DELETE subtasks route method
            const deleteSubtasks = await fetch(`/subtasks/${id}`, {
                method: "DELETE"
            });

        } catch (err) {
            console.error(err.message);
        }
    };

    // Updates whenever main tasks list changes
    useEffect(() => {
        getTodos();
    }, [todos]);
    
    return (<Fragment>
        {" "}
        <table className="table mt-5 text-center task_table">
            <thead>
                <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Complete Task</th>
                    <th scope="col">Edit Task</th>
                    <th scope="col">Delete Task</th>
                </tr>
            </thead>
            <tbody>
                {todos.map(todo => (
                
                    <tr key={todo.todo_id}>
                        <td className="task_name">{todo.description}</td>
                        <td> <button className="btn btn-success complete_task">COMPLETE!</button></td>
                        <td>
                            <EditTodo todo={todo}/>
                        </td>
                        <td>
                            <button className="btn btn-danger" 
                            onClick={() => deleteTodo(todo.todo_id)}
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

export default ListTodo;