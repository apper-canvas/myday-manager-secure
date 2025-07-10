import noteData from "@/services/mockData/notes.json";

class NoteService {
  constructor() {
    this.notes = [...noteData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.notes];
  }

  async getById(id) {
    await this.delay(200);
    const note = this.notes.find(n => n.Id === parseInt(id));
    if (!note) {
      throw new Error("Note not found");
    }
    return { ...note };
  }

  async create(noteData) {
    await this.delay(400);
    const newNote = {
      ...noteData,
      Id: Math.max(...this.notes.map(n => n.Id)) + 1,
      createdAt: noteData.createdAt || new Date().toISOString(),
      updatedAt: noteData.updatedAt || new Date().toISOString()
    };
    this.notes.push(newNote);
    return { ...newNote };
  }

  async update(id, noteData) {
    await this.delay(300);
    const index = this.notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Note not found");
    }
    
    this.notes[index] = { 
      ...this.notes[index], 
      ...noteData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.notes[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Note not found");
    }
    
    this.notes.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const noteService = new NoteService();