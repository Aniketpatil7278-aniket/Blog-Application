const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const header = req.headers['authorization'];
  // Debug: print the header received
  console.log('Authorization header:', header);

  if (!header) return res.status(401).json({ error: "No token Please Login " });

  // Check format: should be "Bearer <token>"
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = parts[1];

  try {
    // Debug: print the secret being used
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    // Debug: print decoding error and the token
    console.log('JWT verify error:', e.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}