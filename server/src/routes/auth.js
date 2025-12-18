const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../database');
const { generateToken, verifyToken } = require('../utils/jwt');

const authRouter = express.Router();

// Регистрация
authRouter.post('/signup', async (req, res) => {
  try {
    const { email, login, password } = req.body;

    // Валидация
    if (!email || !login || !password) {
      res.status(400).json({ error: 'Все поля обязательны' });
      return;
    }

    // Проверка уникальности
    if (db.getUserByEmail(email)) {
      res.status(409).json({ error: 'Пользователь с таким email уже существует' });
      return;
    }

    if (db.getUserByLogin(login)) {
      res.status(409).json({ error: 'Пользователь с таким логином уже существует' });
      return;
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = db.createUser({
      email,
      login,
      password: hashedPassword
    });

    // Генерация токена
    const token = generateToken(user.id, user.login);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        login: user.login
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
authRouter.post('/signin', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400).json({ error: 'Логин и пароль обязательны' });
      return;
    }

    // Поиск пользователя
    const user = db.getUserByLogin(login);
    if (!user) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
      return;
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
      return;
    }

    // Генерация токена
    const token = generateToken(user.id, user.login);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        login: user.login
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Проверка токена
authRouter.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ valid: false });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ valid: false });
    return;
  }

  res.json({ valid: true, user: decoded });
});

module.exports = authRouter;
