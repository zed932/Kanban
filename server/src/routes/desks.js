const express = require('express');
const { authenticate } = require('../middleware/auth');
const { db } = require('../database');

const desksRouter = express.Router();

// Все роуты требуют аутентификации
desksRouter.use(authenticate);

// Получение всех досок пользователя
desksRouter.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDesks = await db.getDesksByUserId(userId);
    res.json(userDesks);
  } catch (error) {
    console.error('Error getting desks:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение конкретной доски
desksRouter.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const deskId = parseInt(req.params.id);

    const desk = await db.getDeskById(deskId);

    if (!desk || desk.userId !== userId) {
      res.status(404).json({ error: 'Доска не найдена' });
      return;
    }

    res.json(desk);
  } catch (error) {
    console.error('Error getting desk:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание новой доски
desksRouter.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, tasksList = [] } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Название доски обязательно' });
      return;
    }

    const newDesk = await db.createDesk({
      name,
      userId,
      tasksList
    });

    res.status(201).json(newDesk);
  } catch (error) {
    console.error('Error creating desk:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление доски
desksRouter.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const deskId = parseInt(req.params.id);

    const desk = await db.getDeskById(deskId);
    if (!desk || desk.userId !== userId) {
      res.status(404).json({ error: 'Доска не найдена' });
      return;
    }

    const updatedDesk = await db.updateDesk(deskId, req.body);
    res.json(updatedDesk);
  } catch (error) {
    console.error('Error updating desk:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление доски
desksRouter.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const deskId = parseInt(req.params.id);

    const desk = await db.getDeskById(deskId);
    if (!desk || desk.userId !== userId) {
      res.status(404).json({ error: 'Доска не найдена' });
      return;
    }

    const success = await db.deleteDesk(deskId);
    res.json({ success });
  } catch (error) {
    console.error('Error deleting desk:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = desksRouter;
