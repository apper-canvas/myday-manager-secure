import timeBlockData from "@/services/mockData/timeBlocks.json";

class TimeBlockService {
  constructor() {
    this.timeBlocks = [...timeBlockData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.timeBlocks];
  }

  async getById(id) {
    await this.delay(200);
    const timeBlock = this.timeBlocks.find(tb => tb.Id === parseInt(id));
    if (!timeBlock) {
      throw new Error("Time block not found");
    }
    return { ...timeBlock };
  }

  async create(timeBlockData) {
    await this.delay(400);
    const newTimeBlock = {
      ...timeBlockData,
      Id: Math.max(...this.timeBlocks.map(tb => tb.Id)) + 1,
      reminder: timeBlockData.reminder || false
    };
    this.timeBlocks.push(newTimeBlock);
    return { ...newTimeBlock };
  }

  async update(id, timeBlockData) {
    await this.delay(300);
    const index = this.timeBlocks.findIndex(tb => tb.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Time block not found");
    }
    
    this.timeBlocks[index] = { ...this.timeBlocks[index], ...timeBlockData };
    return { ...this.timeBlocks[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.timeBlocks.findIndex(tb => tb.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Time block not found");
    }
    
    this.timeBlocks.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const timeBlockService = new TimeBlockService();