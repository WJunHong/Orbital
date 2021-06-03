// Import react modules
import React, { Fragment, useState } from 'react';

// Import 
import InputSubtasks from "./subtasks/InputSubtasks";
import ListSubtasks from './subtasks/ListSubtasks';

/**
 * A functional component for inputting subtasks
 * @param {object} todo - A main task object. 
 * @returns JSX of task modal window
 */
const EditTodo = ({todo}) => {
    // Main task description
    const [description, setDescription] = useState(todo.description);
    
    // Update task description
    const updateDescription = async (e) => {
        // Prevents page from reloading
        e.preventDefault();
        try {
            // Sends updated description of main task to server
            const body = { description };
            const response = await fetch(`/todos/${todo.todo_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            // Sets description on modal header after clicking edit
            setDescription(description);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>
            {/* Button to activate modal */}
            <button 
                type="button" 
                className="btn btn-warning" 
                data-toggle="modal" 
                data-target={`#id${todo.todo_id}`}>
                Edit
            </button>
            {/* Modal */}
            <div className="modal" id={`id${todo.todo_id}`} onClick={() => setDescription(todo.description)}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    
                        <div className="modal-header">
                            <input type ='text' className="form-control" value ={description} onChange={e =>
                                    setDescription(e.target.value)}/>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => setDescription(todo.description)}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <h4>Subtasks</h4>
                            <ListSubtasks todo={todo} />
                            <InputSubtasks todo={todo}/>
                        </div>
                    
                        <div className="modal-footer">
                            <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => updateDescription(e)}>
                                Edit
                            </button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setDescription(todo.description)}>
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default EditTodo;