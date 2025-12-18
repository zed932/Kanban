const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Токен не предоставлен' });
    return;
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ error: 'Неверный формат токена' });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Неверный или просроченный токен' });
    return;
  }

  // Добавляем данные пользователя в запрос
  req.user = decoded;
  next();
};

module.exports = { authenticate };
