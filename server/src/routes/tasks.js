const express = require('express');
const { authenticate } = require('../middleware/auth');
const { db } = require('../database');

const tasksRouter = express.Router();

tasksRouter.use(authenticate);

// Добавить задачу к доске
tasksRouter.post('/desk/:deskId', async (req, res) => {
  try {
    const userId = req.user.userId;
    const deskId = parseInt(req.params.deskId);
    const taskData = req.body;

    // Проверяем принадлежность доски
    const desk = await db.getDeskById(deskId);
    if (!desk || desk.userId !== userId) {
      res.status(404).json({ error: 'Доска не найдена' });
      return;
    }

    const newTask = await db.addTaskToDesk(deskId, {
      ...taskData,
      isCompleted: false
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить задачу
tasksRouter.put('/desk/:deskId/:taskId', async (req, res) => {
  try {
    const userId = req.user.userId;
    const deskId = parseInt(req.params.deskId);
    const taskId = parseInt(req.params.taskId);

    // Проверяем принадлежность доски
    const desk = await db.getDeskById(deskId);
    if (!desk || desk.userId !== userId) {
      res.status(404).json({ error: 'Доска не найдена' });
      return;
    }

    const updatedTask = await db.updateTask(deskId, taskId, req.body);
    if (!updatedTask) {
      res.status(404).json({ error: 'Задача не найдена' });
      return;
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить задачу
tasksRouter.delete('/desk/:deskId/:taskId', async (req, res) => {
  try {
    const userId = req.user.userId;
    const deskId = parseInt(req.params.deskId);
    const taskId = parseInt(req.params.taskId);

    // Проверяем принадлежность доски
    const desk = await db.getDeskById(deskId);
    if (!desk || desk.userId !== userId) {
      res.status(404).json({ error: 'Доска не найдена' });
      return;
    }

    const success = await db.deleteTask(deskId, taskId);
    if (!success) {
      res.status(404).json({ error: 'Задача не найдена' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = tasksRouter;
