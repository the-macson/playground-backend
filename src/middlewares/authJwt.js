const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(403).json({ message: 'No token provided!' });
    return;
  }
  token = token.slice(7, token.length);
  try {
    const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);
    req.authInfo = decoded;
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized!' });
    return;
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.authInfo.role === 'admin') {
    next();
    return;
  }
  res.status(403).json({ message: 'Require Admin Role!' });
};

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;
