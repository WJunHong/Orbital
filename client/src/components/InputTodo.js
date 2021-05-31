// Imports
import React, { Fragment,useState } from "react";

/**
 * A functional component representing the input of a task
 * @returns JSX of input field and add button
 */
const InputToDo = () => {

    // Description of a task
    const [description, setDescription] = useState("");
    
    const onSubmitForm = async e => {
        
        // Prevents page from reloading on form submission
        e.preventDefault();
        try {
            if (description === "") {
                // If task field is empty, do not submit anything
            } else {
                // Sends a request to create the new task in server
                const body = { description };
                const response = await fetch("/todos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(body)
                });
                
                // Reset the input field to empty upon successful task submission
                document.querySelector(".add_task").value = "";
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
          <form className="d-flex" onSubmit={onSubmitForm} >
            <input type="text"
            className="form-control add_task" 
            placeholder= "Input task"
            onChange={e =>
            setDescription(e.target.value)}
            autoComplete="off"/>
            
            <button className="btn btn-success add_button"> Add</button>
        </form>
        </ Fragment>
    );
};

export default InputToDo;
