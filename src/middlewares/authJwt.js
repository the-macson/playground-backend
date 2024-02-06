const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  // console.log(req.headers);
  let token = req.headers.authorization;
  // console.log(token);
  // remove Bearer from string
  token = token.slice(7, token.length);
  if (!token) {
    res.status(403).json({ message: 'No token provided!' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);
    req.user = decoded;
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized!' });
    return;
  }
  next();
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
