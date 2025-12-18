const express = require('express');
const { authenticate } = require('../middleware/auth');
const { db } = require('../database');

const desksRouter = express.Router();

// Все роуты требуют аутентификации
desksRouter.use(authenticate);

// Получение всех досок пользователя
desksRouter.get('/', (req, res) => {
  const userId = req.user.userId;
  const userDesks = db.getDesksByUserId(userId);
  res.json(userDesks);
});

// Получение конкретной доски
desksRouter.get('/:id', (req, res) => {
  const userId = req.user.userId;
  const deskId = parseInt(req.params.id);

  const desk = db.getDeskById(deskId);

  if (!desk || desk.userId !== userId) {
    res.status(404).json({ error: 'Доска не найдена' });
    return;
  }

  res.json(desk);
});

// Создание новой доски
desksRouter.post('/', (req, res) => {
  const userId = req.user.userId;
  const { name, tasksList = [] } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Название доски обязательно' });
    return;
  }

  const newDesk = db.createDesk({
    name,
    userId,
    tasksList
  });

  res.status(201).json(newDesk);
});

// Обновление доски
desksRouter.put('/:id', (req, res) => {
  const userId = req.user.userId;
  const deskId = parseInt(req.params.id);

  const desk = db.getDeskById(deskId);
  if (!desk || desk.userId !== userId) {
    res.status(404).json({ error: 'Доска не найдена' });
    return;
  }

  const updatedDesk = db.updateDesk(deskId, req.body);
  res.json(updatedDesk);
});

// Удаление доски
desksRouter.delete('/:id', (req, res) => {
  const userId = req.user.userId;
  const deskId = parseInt(req.params.id);

  const desk = db.getDeskById(deskId);
  if (!desk || desk.userId !== userId) {
    res.status(404).json({ error: 'Доска не найдена' });
    return;
  }

  const success = db.deleteDesk(deskId);
  res.json({ success });
});

module.exports = desksRouter;
