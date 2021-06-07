const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db1");
const passport = require("passport");
const validInfo = require("../middleware/validInfo");

// Fires route upon registration

router.post("/register", validInfo, async (req, res) => {
  try {
    // 1. Destructure the req.body()

    const { name, email, password } = req.body;

    // 2. Check if user exists (if already exists throw error)

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }
    // 3. Bcrypt the user password

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter the new user inside db

    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    /*
    // 5. Generating jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    // Return the JWT token upon registration
    return res.json({ token });
    */
    res.send("User Created");
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Fire route upon login

router.post("/login", validInfo, async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

/*
// Fire route upon verification

router.get("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
*/

module.exports = router;