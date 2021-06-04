const router = require("express").Router();
const pool = require("../db1");

// Creating a subtask
router.post("/", async (req, res) => {
    try {
        const {
            user_id, // added
            task_id,
            description
        } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO subtasks (user_id, task_id, description) VALUES($1, $2, $3) RETURNING *",
            [user_id, task_id, description]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


// Get all subtasks related to a maintask based on its id

router.get("/:todo_id", async (req, res) => {
    try {
        const {
            todo_id
        } = req.params;
        const allSubtasks = await pool.query("SELECT * FROM subtasks WHERE task_id = $1 ORDER BY subtask_id ASC", [todo_id]);
        res.json(allSubtasks.rows);
    } catch (error) {
        console.error(error.message);
    }
});


// Update a subtask based on main task id and sub task id

router.put("/:todo_id/:sid", async (req, res) => {
    try {
        const {
            sid
        } = req.params;
        const {
            description
        } = req.body;
        const updateTodo = await pool.query("UPDATE subtasks SET description = $1 WHERE subtask_id = $2",
            [description, sid]);
        res.json("Subtask was updated!");
    } catch (error) {
        console.error(error.message);
    }
});

// Delete a subtask based on main task id and sub task id

router.delete("/:todo_id/:sid", async (req, res) => {
    try {
        const {
            sid
        } = req.params;
        const deleteTodo = await pool.query("DELETE FROM subtasks WHERE subtask_id = $1", [sid]);

        res.json("Subtask was deleted!");
    } catch (error) {
        console.error(error.message);
    }
});

// Delete ALL subtasks pertaining to the main task

router.delete("/:todo_id", async (req, res) => {
    try {
        const {
            todo_id
        } = req.params;
        const deleteAllSubtasks = await pool.query("DELETE FROM subtasks WHERE task_id = $1", [todo_id]);
        res.json("All subtasks deleted!");
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;