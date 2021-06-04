const router = require("express").Router();
const pool = require("../db1");

// Input todo
router.post("/", async (req, res) => {
    try {
        // Obtain the user_id and description of the task
        const {user_id, description} = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (user_id, description) VALUES($1, $2) RETURNING *", 
            [user_id, description]
        );

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all todos

router.get("/", async (req, res) => {
    try {
        const {user_id} = req.headers;
        const allTodos = await pool.query("SELECT * FROM todo WHERE user_id = $1 ORDER BY todo_id ASC",
            [user_id]);
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// Get a todo

router.get("/:todo_id", async (req, res) => {
    try {
        const { todo_id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [todo_id]);

        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Update a todo

router.put("/:todo_id", async (req, res) => {
    try {
        const { todo_id } = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, todo_id]);

        res.json("Todo was updated!");
    } catch (error) {
        console.error(error.message);
    }
});


// Delete a todo

router.delete("/:todo_id", async (req, res) => {
    try {
        const { todo_id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [todo_id]);

        res.json("Todo was deleted!");
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;