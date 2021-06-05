const router = require("express").Router();
const authorize = require("../middleware/authorization");
const pool = require("../db1");


// Fire route upon call to server
router.get("/", authorize, async (req, res) => {
  try {
    // User is extracted from authorization middleware
    const user = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user.id] 
    ); 
    
  //if would be req.user if you change your payload to this:
    
  //   function jwtGenerator(user_id) {
  //   const payload = {
  //     user: user_id
  //   };
    // User "name" & "uuid" are returned if authorized
    res.json([user.rows[0], { user_id: req.user.id }]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;