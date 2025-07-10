import mockData from '@/services/mockData/expenses.json';

let expenses = [...mockData];
let nextId = Math.max(...expenses.map(e => e.Id)) + 1;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseService = {
  async getAll() {
    await delay(200);
    return [...expenses];
  },

  async getById(id) {
    await delay(200);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid expense ID');
    }
    const expense = expenses.find(e => e.Id === parsedId);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return { ...expense };
  },

  async create(expenseData) {
    await delay(300);
    const newExpense = {
      ...expenseData,
      Id: nextId++,
      date: expenseData.date || new Date().toISOString()
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async update(id, expenseData) {
    await delay(300);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid expense ID');
    }
    const index = expenses.findIndex(e => e.Id === parsedId);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    expenses[index] = { ...expenses[index], ...expenseData, Id: parsedId };
    return { ...expenses[index] };
  },

  async delete(id) {
    await delay(200);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid expense ID');
    }
    const index = expenses.findIndex(e => e.Id === parsedId);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    expenses.splice(index, 1);
    return true;
  }
};