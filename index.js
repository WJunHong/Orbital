// Modules for express and cors
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
// Connect React to Express
app.use(cors());
// Use req.body
app.use(express.json());

// Routes

// Todo Tasks
    // Creating a todo

    app.post("/todos", async (req, res) => {
        try {
            const {description} = req.body;
            const newTodo = await pool.query(
                "INSERT INTO todo (description) VALUES($1) RETURNING *", 
                [description]
            );

            res.json(newTodo.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });

    // Get all todos

    app.get("/todos", async(req, res) => {
        try {
            const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id ASC");
            res.json(allTodos.rows);
        } catch (error) {
            console.error(err.message);
        }
    });

    // Get a todo

    app.get("/todos/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

            res.json(todo.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });

    // Update a todo

    app.put("/todos/:id", async (req, res) => {
        try {
            const {id} = req.params;
            const {description} = req.body;
            const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]);

            res.json("Todo was updated!");
        } catch (error) {
            console.error(err.message);
        }
    });


    // Delete a todo

    app.delete("/todos/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

            res.json("Todo was deleted!");
        } catch (error) {
            console.error(err.message);
        }
    });

// Subtasks
    // Creating a subtask
 
    app.post("/subtasks/", async (req, res) => {
        try {
            const {task_id, description} = req.body;
            const newTodo = await pool.query(
                "INSERT INTO subtasks (task_id, description) VALUES($1, $2) RETURNING *", 
                [task_id,description]
            );
            res.json(newTodo.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });

    
    // Get all subtasks related to a maintask based on its id

    app.get("/subtasks/:id", async(req, res) => {
        try {
            const {id} = req.params;
            const allSubtasks = await pool.query("SELECT * FROM subtasks WHERE task_id = $1 ORDER BY subtask_id ASC", [id]);
            res.json(allSubtasks.rows);
        } catch (error) {
            console.error(error.message);
        }
    });

    
    // Update a subtask based on main task id and sub task id

    app.put("/subtasks/:id/:sid", async (req, res) => {
        try {
            const {sid} = req.params;
            const {description} = req.body;
            const updateTodo = await pool.query("UPDATE subtasks SET description = $1 WHERE subtask_id = $2",
            [description, sid]);
            res.json("Subtask was updated!");
        } catch (error) {
            console.error(err.message);
        }
    });

    // Delete a subtask based on main task id and sub task id

    app.delete("/subtasks/:id/:sid", async (req, res) => {
        try {
            const { sid } = req.params;
            const deleteTodo = await pool.query("DELETE FROM subtasks WHERE subtask_id = $1", [sid]);

            res.json("Subtask was deleted!");
        } catch (error) {
            console.error(err.message);
        }
    });

    // Delete ALL subtasks pertaining to the main task

    app.delete("/subtasks/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const deleteAllSubtasks = await pool.query("DELETE FROM subtasks WHERE task_id = $1", [id]);
            res.json("All subtasks deleted!");
        } catch (error) {
            console.error(error.message);
        }
    });

app.listen(5000, () => {
    console.log("server has started on port 5000")
}); 