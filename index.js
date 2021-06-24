// Modules for express and cors
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db1");
const path = require("path");
const PORT = process.env.PORT || 5000;

// Middleware
// Connect React to Express
app.use(cors());
// Use req.body
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Routes for user login

app.use("/api/auth", require("./routes/jwtAuth"));
app.use("/api", require("./routes/taskpage"));

// Routes for todo-list
app.use("/api/todos", require("./routes/taskRoutes"));
app.use("/api/subtasks", require("./routes/subtaskRoutes"));
app.use("/api/filter", require("./routes/filterTasks"));

app.listen(PORT, () => {
  console.log("server has started on port 5000");
});
