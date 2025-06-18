const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_jwt-token";

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Permission denied" });
  }
  next();
};

module.exports = { authenticate, authorize };
