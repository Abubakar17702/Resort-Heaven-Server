const jwt = require("jsonwebtoken"); // Ensure jwt is imported

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  // Check if Authorization header exists
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .send({ message: "Unauthorized access, token missing" });
  }

  // Split the Authorization header to extract the token
  const parts = authHeader.split(" ");

  // Check if the Authorization header follows the 'Bearer <token>' format
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .send({ message: "Authorization header format is invalid" });
  }

  const token = parts[1]; // Extract the token

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token is invalid!" });
    }
    req.decoded = decoded; // Attach the decoded token data to the request
    next(); // Proceed to the next middleware
  });
};

module.exports = verifyToken;
