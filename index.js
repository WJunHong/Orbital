// Modules for express and cors
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;
const passport = require("passport");
const passportLocal = require('passport-local').Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passportConfig = require("./utils/passportConfig");
require("dotenv").config();

// Middleware
// Connect React to Express
app.use(cors());
// Use req.body
app.use(express.json());

app.use(express.static("public"));
app.use(
    session({ 
        secret: process.env.secretPassport,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.secretPassport));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
}

// Routes for user login

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/taskpage"));

// Routes for todo-list
app.use("/todos", require("./routes/taskRoutes"));
app.use("/subtasks", require("./routes/subtaskRoutes"));
app.use("/filter", require("./routes/filterTasks"));


app.listen(PORT, () => {
    console.log("server has started on port 5000")
}); 