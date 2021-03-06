const router = require("express").Router();
const pool = require("../db1");

// Creating a subtask
router.post("/", async (req, res) => {
  try {
    const { user_id, task_id, description } = req.body;
    const list = await pool.query(
      "SELECT list FROM todo WHERE user_id = $1 AND todo_id = $2",
      [user_id, task_id]
    );
    const newTodo = await pool.query(
      "INSERT INTO subtasks (user_id, todo_id, description, completed, list) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [user_id, task_id, description, false, list.rows[0].list]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Get all subtasks of a user
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.headers;
    const todoId = await pool.query(
      "SELECT array_agg(DISTINCT todo_id) unique_todoids FROM subtasks WHERE user_id = $1 and completed = false",
      [user_id]
    );
    const allSubtasks = await pool.query(
      "SELECT * FROM subtasks WHERE user_id = $1 and completed = false",
      [user_id]
    );

    const todos = todoId.rows[0].unique_todoids || [];
    const subtasks = allSubtasks.rows;
    const arrangedSubtasks = todos.map((id) => [
      id,
      subtasks.filter((i) => i.todo_id === id)
    ]);
    res.json(arrangedSubtasks);
  } catch (err) {
    console.error(err.message);
  }
});
// Get all subtasks related to a maintask based on its id

router.get("/:todo_id", async (req, res) => {
  try {
    const { todo_id } = req.params;
    const allSubtasks = await pool.query(
      "SELECT * FROM subtasks WHERE todo_id = $1 ORDER BY subtask_id ASC",
      [todo_id]
    );
    res.json(allSubtasks.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Update description or Complete a subtask
router.put("/:todo_id/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const { description, completed } = req.body;
    const updateTodo = await pool.query(
      "UPDATE subtasks SET description = $1, completed = $2 WHERE subtask_id = $3",
      [description, completed, sid]
    );
    res.json("Subtask was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

// Strictly complete a task
router.put("/complete/subtask/:boolean", async (req, res) => {
  try {
    const { boolean } = req.params
    const { subtaskIds } = req.body;
    const updateTodo = async (id) => pool.query(
      "UPDATE subtasks SET completed = $1 WHERE subtask_id = $2",
      [boolean, id]
    );
    subtaskIds.forEach((sid) => {
       updateTodo(sid)
    });

    res.json("Subtask was completed!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a subtask based on main task id and sub task id

router.delete("/:todo_id/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM subtasks WHERE subtask_id = $1",
      [sid]
    );

    res.json("Subtask was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete ALL subtasks pertaining to the main task

router.delete("/:todo_id", async (req, res) => {
  try {
    const { todo_id } = req.params;
    const deleteAllSubtasks = await pool.query(
      "DELETE FROM subtasks WHERE todo_id = $1",
      [todo_id]
    );
    res.json("All subtasks deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
