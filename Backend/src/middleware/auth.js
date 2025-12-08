const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  console.log('Authorization header:', header);

  if (!header) return res.status(401).json({ error: 'No token. Please login.' });

  const parts = header.split(' ');
  // allow  just the token
  const token = parts.length === 2 ? parts[1] : parts[0];

  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT decoded payload:', decoded);

    // support a few possible claim names
    const userId = decoded.id || decoded._id || decoded.userId;
    if (!userId) {
      console.warn('JWT has no id/_id/userId claim');
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = { id: String(userId), raw: decoded };
    return next();
  } catch (err) {
    console.log('JWT verify error:', err && err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};