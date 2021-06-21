const router = require("express").Router();
const pool = require("../db1");

// Day adder
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var day = date.getDate().toString().padStart(2, "0");
  var end_date = `${year}-${month}-${day} 23:59:59`;
  return end_date;
};

router.get("/todos/today", async (req, res) => {
  try {
    // Get the user id
    const { user_id } = req.headers;
    // Retrieve todays date (needs to be yyyy-mm-dd)
    const date = new Date();
    date.toISOString().split("T")[0];
    // Query times which match todays date
    const todayTasks = await pool.query(
      "SELECT * FROM todo WHERE user_id = $1 AND deadline = $2",
      [user_id, date]
    );
    // Return the tasks happening today for the user
    res.json(todayTasks.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// All tasks within the week
router.get("/todos", async (req, res) => {
  try {
    // Get the user id
    const { user_id } = req.headers;
    // Retrieve todays date
    var sd = new Date();
    var year = sd.getFullYear();
    var month = (sd.getMonth() + 1).toString().padStart(2, "0");
    var day = sd.getDate().toString().padStart(2, "0");
    var start_date = `${year}-${month}-${day} 00:00:00`;
    var end_date = new Date().addDays(7);
    // Query times which match todays date
    const todayTasks = await pool.query(
      "SELECT * FROM todo WHERE user_id = $1 AND deadline >= $2 AND deadline <= $3 AND completed = false",
      [user_id, start_date, end_date]
    );
    // Return the tasks happening today for the user
    res.json(todayTasks.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/properties", async (req, res) => {
  try {
    // Get the user id
    const { user_id } = req.headers;
    const properties = await pool.query(
      "SELECT array_agg(DISTINCT u.val) unique_properties from todo cross join lateral UNNEST(properties) as u(val) WHERE user_id = $1",
      [user_id]
    );

    // Return ALL UNIQUE properties of user
    res.json(properties.rows[0]);
  } catch (error) {
    console.error("hi db");
    console.error(error.message);
  }
});

module.exports = router;
