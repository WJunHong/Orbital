module.exports = function(req, res, next) {

  // Destructure registration / login body from client side
    const { email, name, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    
    // Checks if the req is coming from /register of the jwtAuth route
    if (req.path === "/register") {
      if (![email, name, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
      }
    } else if (req.path === "/login") {
      // Checkf if the req is coming from the /login of the jwtAuth route
      if (![email, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
      }
    }
    // Once everything checks out, cotinue on with the route
    next();
  };