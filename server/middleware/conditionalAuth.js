const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "a_really_secret_key";

function conditionalAuth(req, res, next) {
  console.log("JWT_ENABLED:", process.env.JWT_ENABLED);

  if (process.env.JWT_ENABLED === "false") {
    console.log("JWT authentication is disabled");
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log("Invalid token");
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

module.exports = conditionalAuth;
