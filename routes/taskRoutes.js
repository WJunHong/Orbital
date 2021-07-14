const router = require("express").Router();
const pool = require("../db1");

// Input todo
router.post("/", async (req, res) => {
  try {
    // Obtain the user_id and description of the task
    const {
      user_id,
      description,
      startDate,
      todoDate,
      todoEndDate,
      priority,
      properties,
      listName,
    } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (user_id, description, completed, deadline,tododate,todoenddate,priority, properties,progress, list) VALUES($1, $2, $3, $4, $5,$6,$7,$8, $9, $10) RETURNING *",
      [
        user_id,
        description,
        false,
        startDate,
        todoDate,
        todoEndDate,
        priority,
        properties,
        0,
        listName,
      ]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Add a list
router.post("/lists", async (req, res) => {
  try {
    // Obtain the user_id and description of the task
    const { user_id, listName } = req.body;
    const newList = await pool.query(
      "INSERT INTO lists (user_id, list) VALUES($1, $2) RETURNING *",
      [user_id, listName]
    );

    res.json(newList.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Get all lists of a user
router.get("/lists", async (req, res) => {
  try {
    // Obtain the user_id and description of the task
    const { user_id } = req.headers;
    const lists = await pool.query(
      // "SELECT list FROM lists WHERE user_id = $1",
      "SELECT array_agg(list) lists from lists WHERE user_id = $1",
      [user_id]
    );

    res.json(lists.rows[0].lists);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete all tasks in a list
router.delete("/:list/todos", async (req, res) => {
  try {
    const { list } = req.params;
    const { user_id } = req.headers;
    const deleteAllTasks = await pool.query(
      "DELETE FROM todo WHERE user_id = $1 AND list = $2",
      [user_id, list]
    );
    res.json("All tasks in a list deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete all subtasks in a list
router.delete("/:list/subtasks", async (req, res) => {
  try {
    const { list } = req.params;
    const { user_id } = req.headers;
    const deleteAllTasks = await pool.query(
      "DELETE FROM subtasks WHERE user_id = $1 AND list = $2",
      [user_id, list]
    );
    res.json("All subtasks in a list deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a list
router.delete("/lists/:list", async (req, res) => {
  try {
    const { list } = req.params;
    const { user_id } = req.headers;
    const deleteAllTasks = await pool.query(
      "DELETE FROM lists WHERE user_id = $1 AND list = $2",
      [user_id, list]
    );
    res.json("List deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Get all uncompleted todos

router.get("/", async (req, res) => {
  try {
    const { user_id } = req.headers;
    const allTodos = await pool.query(
      "SELECT user_id, todo_id, description, deadline::timestamptz + INTERVAL '8 hour' as deadline, tododate::timestamptz + INTERVAL '8 hour' as tododate, todoenddate::timestamptz + INTERVAL '8 hour' as todoenddate, priority, progress, properties, completed FROM todo WHERE user_id = $1 AND completed = false ORDER BY todo_id ASC",
      [user_id]
    );
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/:listName", async (req, res) => {
  try {
    const { user_id } = req.headers;
    const { listName } = req.params;
    const allTodos = await pool.query(
      "SELECT user_id, todo_id, description, deadline::timestamptz + INTERVAL '8 hour' as deadline, tododate::timestamptz + INTERVAL '8 hour' as tododate, priority, progress, properties, completed FROM todo WHERE user_id = $1 AND completed = false AND list = $2 ORDER BY todo_id ASC",
      [user_id, listName]
    );
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Get all completed todos
router.get("/completed", async (req, res) => {
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
    const {
      description,
      completed,
      deadline,
      tododate,
      todoenddate,
      priority,
      progress,
      properties,
      list,
    } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1, completed = $3, deadline = $4, tododate = $5, todoenddate = $6, priority = $7, progress = $8, properties = $9, list = $10 WHERE todo_id = $2",
      [
        description,
        todo_id,
        completed,
        deadline,
        tododate,
        todoenddate,
        priority,
        progress,
        properties,
        list,
      ]
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
