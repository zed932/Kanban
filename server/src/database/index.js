const bcrypt = require('bcryptjs');

// Инициализируем базу данных в памяти
const users = [
  {
    id: 1,
    email: 'user@example.com',
    login: 'user',
    password: bcrypt.hashSync('password123', 10)
  }
];

const desks = [
  {
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
  }
];

// Генератор ID
let userIdCounter = 2;
let deskIdCounter = 2;

const db = {
  users,
  desks,

  getUserById(id) {
    return this.users.find(user => user.id === id);
  },

  getUserByLogin(login) {
    return this.users.find(user => user.login === login);
  },

  getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  },

  createUser(user) {
    const newUser = {
      ...user,
      id: userIdCounter++
    };
    this.users.push(newUser);
    return newUser;
  },

  getDesksByUserId(userId) {
    return this.desks.filter(desk => desk.userId === userId);
  },

  getDeskById(id) {
    return this.desks.find(desk => desk.id === id);
  },

  createDesk(desk) {
    const newDesk = {
      ...desk,
      id: deskIdCounter++
    };
    this.desks.push(newDesk);
    return newDesk;
  },

  updateDesk(id, updates) {
    const index = this.desks.findIndex(desk => desk.id === id);
    if (index === -1) return null;

    this.desks[index] = { ...this.desks[index], ...updates };
    return this.desks[index];
  },

  deleteDesk(id) {
    const index = this.desks.findIndex(desk => desk.id === id);
    if (index === -1) return false;

    this.desks.splice(index, 1);
    return true;
  }
};

module.exports = { db };
