const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-this-in-production';

const generateToken = (userId, login) => {
  return jwt.sign(
    { userId, login },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
