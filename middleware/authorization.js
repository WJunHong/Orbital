const jwt = require("jsonwebtoken");
require("dotenv").config();

// this middleware will on continue on if the token is inside the local storage

module.exports = function(req, res, next) {

  // Get token from header
  const token = req.header("token");

  // Check if token exists
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
  try {
    
    //it is going to give us the user id (user:{id: user.id})
    const verify = jwt.verify(token, process.env.jwtSecret);
    
    // Set req.user to the value of user_id, to be used in taskpage.js
    req.user = verify.user;

    // Once everything ok, continue on with the routes
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};