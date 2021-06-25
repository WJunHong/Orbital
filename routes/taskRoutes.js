const router = require("express").Router();
const pool = require("../db1");

// Input todo
router.post("/", async (req, res) => {
  try {
    // Obtain the user_id and description of the task
    const { user_id, description, startDate, todoDate, priority, properties } =
      req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (user_id, description, completed, deadline,tododate,priority, properties,progress) VALUES($1, $2, $3, $4, $5,$6,$7,$8) RETURNING *",
      [
        user_id,
        description,
        false,
        startDate,
        todoDate,
        priority,
        properties,
        0,
      ]
    );

    /*properties.forEach(async (property) => {
      try {
        const updateProperties = await pool.query(
          "INSERT INTO properties (user_id, property_name) VALUES($1, $2) RETURNING *",
          [user_id, property]
        );
      } catch (err) {
        console.error(err);
      }
    });*/

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Get all uncompleted todos

router.get("/", async (req, res) => {
  try {
    const { user_id } = req.headers;
    const allTodos = await pool.query(
      "SELECT user_id, todo_id, description, deadline::timestamptz + INTERVAL '8 hour' as deadline, tododate::timestamptz + INTERVAL '8 hour' as tododate, priority, progress, properties, completed FROM todo WHERE user_id = $1 AND completed = false ORDER BY todo_id ASC",
      [user_id]
    );
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Get all completed todos
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.headers;
    const allTodos = await pool.query(
      "SELECT user_id, todo_id, description, deadline::timestamptz + INTERVAL '8 hour' as deadline, tododate, priority, progress, properties, completed FROM todo WHERE user_id = $1 AND completed = true ORDER BY todo_id ASC",
      [user_id]
    );
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});
// Get a todo

router.get("/:todo_id", async (req, res) => {
  try {
    const { todo_id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      todo_id,
    ]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a todo

router.put("/:todo_id", async (req, res) => {
  try {
    const { todo_id } = req.params;
    const { description, completed } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1, completed = $3 WHERE todo_id = $2",
      [description, todo_id, completed]
    );

    res.json("Todo was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a todo

router.delete("/:todo_id", async (req, res) => {
  try {
    const { todo_id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      todo_id,
    ]);

    res.json("Todo was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
