const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

// Пути к файлам
const USERS_FILE = path.join(__dirname, 'users.json');
const DESKS_FILE = path.join(__dirname, 'desks.json');

class Database {
  constructor() {
    this.init();
  }

  async init() {
    try {
      // Проверяем существование файлов, если нет - создаем
      await this.ensureFileExists(USERS_FILE, []);
      await this.ensureFileExists(DESKS_FILE, []);

      // Добавляем тестового пользователя если файл пуст
      await this.ensureDefaultUser();
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async ensureFileExists(filePath, defaultValue) {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
    }
  }

  async ensureDefaultUser() {
    const users = await this.readFile(USERS_FILE);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const defaultUser = {
        id: 1,
        email: 'user@example.com',
        login: 'user',
        password: hashedPassword
      };
      users.push(defaultUser);
      await this.writeFile(USERS_FILE, users);

      // Добавляем тестовую доску
      const desks = await this.readFile(DESKS_FILE);
      desks.push({
        id: 1,
        name: 'FirstDesk',
        userId: 1,
        tasksList: [
          {
            id: 1,
            name: 'Купить молоко',
            description: 'Необходимо купить молока для матушки',
            isCompleted: false
          },
          {
            id: 2,
            name: 'Сходить в школу',
            description: 'Сегодня я должен пойти в школу и получить пятерку',
            isCompleted: false
          }
        ]
      });
      await this.writeFile(DESKS_FILE, desks);
    }
  }

  async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return [];
    }
  }

  async writeFile(filePath, data) {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
      throw error;
    }
  }

  // User methods
  async getUserById(id) {
    const users = await this.readFile(USERS_FILE);
    return users.find(user => user.id === id);
  }

  async getUserByLogin(login) {
    const users = await this.readFile(USERS_FILE);
    return users.find(user => user.login === login);
  }

  async getUserByEmail(email) {
    const users = await this.readFile(USERS_FILE);
    return users.find(user => user.email === email);
  }

  async createUser(user) {
    const users = await this.readFile(USERS_FILE);
    const newUser = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
    };
    users.push(newUser);
    await this.writeFile(USERS_FILE, users);
    return newUser;
  }

  // Desk methods
  async getDesksByUserId(userId) {
    const desks = await this.readFile(DESKS_FILE);
    return desks.filter(desk => desk.userId === userId);
  }

  async getDeskById(id) {
    const desks = await this.readFile(DESKS_FILE);
    return desks.find(desk => desk.id === id);
  }

  async createDesk(desk) {
    const desks = await this.readFile(DESKS_FILE);
    const newDesk = {
      ...desk,
      id: desks.length > 0 ? Math.max(...desks.map(d => d.id)) + 1 : 1
    };
    desks.push(newDesk);
    await this.writeFile(DESKS_FILE, desks);
    return newDesk;
  }

  async updateDesk(id, updates) {
    const desks = await this.readFile(DESKS_FILE);
    const index = desks.findIndex(desk => desk.id === id);
    if (index === -1) return null;

    desks[index] = { ...desks[index], ...updates };
    await this.writeFile(DESKS_FILE, desks);
    return desks[index];
  }

  async deleteDesk(id) {
    const desks = await this.readFile(DESKS_FILE);
    const index = desks.findIndex(desk => desk.id === id);
    if (index === -1) return false;

    desks.splice(index, 1);
    await this.writeFile(DESKS_FILE, desks);
    return true;
  }

  // Task methods (для будущего расширения)
  async addTaskToDesk(deskId, task) {
    const desks = await this.readFile(DESKS_FILE);
    const deskIndex = desks.findIndex(desk => desk.id === deskId);
    if (deskIndex === -1) return null;

    const tasks = desks[deskIndex].tasksList;
    const newTask = {
      ...task,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
    };

    desks[deskIndex].tasksList.push(newTask);
    await this.writeFile(DESKS_FILE, desks);
    return newTask;
  }

  async updateTask(deskId, taskId, updates) {
    const desks = await this.readFile(DESKS_FILE);
    const deskIndex = desks.findIndex(desk => desk.id === deskId);
    if (deskIndex === -1) return null;

    const taskIndex = desks[deskIndex].tasksList.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return null;

    desks[deskIndex].tasksList[taskIndex] = {
      ...desks[deskIndex].tasksList[taskIndex],
      ...updates
    };

    await this.writeFile(DESKS_FILE, desks);
    return desks[deskIndex].tasksList[taskIndex];
  }

  async deleteTask(deskId, taskId) {
    const desks = await this.readFile(DESKS_FILE);
    const deskIndex = desks.findIndex(desk => desk.id === deskId);
    if (deskIndex === -1) return false;

    const taskIndex = desks[deskIndex].tasksList.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return false;

    desks[deskIndex].tasksList.splice(taskIndex, 1);
    await this.writeFile(DESKS_FILE, desks);
    return true;
  }
}

// Создаем и экспортируем экземпляр базы данных
const db = new Database();
module.exports = { db };
