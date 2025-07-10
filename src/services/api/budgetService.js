import mockData from '@/services/mockData/budgets.json';

let budgets = [...mockData];
let nextId = Math.max(...budgets.map(b => b.Id)) + 1;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const budgetService = {
  async getAll() {
    await delay(200);
    return [...budgets];
  },

  async getById(id) {
    await delay(200);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid budget ID');
    }
    const budget = budgets.find(b => b.Id === parsedId);
    if (!budget) {
      throw new Error('Budget not found');
    }
    return { ...budget };
  },

  async create(budgetData) {
    await delay(300);
    // Check if budget already exists for this category
    const existingBudget = budgets.find(b => b.category === budgetData.category);
    if (existingBudget) {
      throw new Error('Budget already exists for this category');
    }
    const newBudget = {
      ...budgetData,
      Id: nextId++
    };
    budgets.push(newBudget);
    return { ...newBudget };
  },

  async update(id, budgetData) {
    await delay(300);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid budget ID');
    }
    const index = budgets.findIndex(b => b.Id === parsedId);
    if (index === -1) {
      throw new Error('Budget not found');
    }
    budgets[index] = { ...budgets[index], ...budgetData, Id: parsedId };
    return { ...budgets[index] };
  },

  async delete(id) {
    await delay(200);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid budget ID');
    }
    const index = budgets.findIndex(b => b.Id === parsedId);
    if (index === -1) {
      throw new Error('Budget not found');
    }
    budgets.splice(index, 1);
    return true;
  }
};