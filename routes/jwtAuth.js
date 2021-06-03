const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db1");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorization");

// Registering

router.post("/register", validInfo, async (req, res) => {
    try {
        // 1. Destructure the req.body()

        const { name, email, password} = req.body;
        
        // 2. Check if user exists (if not throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", 
        [email]);
        
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

        // 5. Generating jwt token
        
        const jwtToken = jwtGenerator(newUser.rows[0].user_id);
        return res.json({ jwtToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Login

router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    
    // 1. Check if user has entered valid email

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    // 2. Check if user has typed in valid password

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    
    // 3. Generate the JWToken for the user
    const jwtToken = jwtGenerator(user.rows[0].user_id);

    // 4. Return the JWT as a json object
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;