const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";

function authenticateToken(req, res, next) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded; 
    req.employeeId = decoded.employeeId;// Add decoded user info to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
  }
}

module.exports = authenticateToken;
