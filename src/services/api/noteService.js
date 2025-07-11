import { toast } from "react-toastify";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NoteService {
  async getAll() {
    await delay(300);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };

      const response = await apperClient.fetchRecords('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(note => ({
        Id: note.Id,
        Name: note.Name,
        tags: note.Tags ? note.Tags.split(',') : [],
        title: note.title,
        content: note.content,
        createdAt: note.created_at,
        updatedAt: note.updated_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    await delay(200);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };

      const response = await apperClient.getRecordById('note', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const note = response.data;
      return {
        Id: note.Id,
        Name: note.Name,
        tags: note.Tags ? note.Tags.split(',') : [],
        title: note.title,
        content: note.content,
        createdAt: note.created_at,
        updatedAt: note.updated_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching note with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(noteData) {
    await delay(400);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: noteData.Name || noteData.title || 'Note',
          Tags: Array.isArray(noteData.tags) ? noteData.tags.join(',') : '',
          title: noteData.title,
          content: noteData.content,
          created_at: noteData.createdAt || new Date().toISOString(),
          updated_at: noteData.updatedAt || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const note = successfulRecords[0].data;
          return {
            Id: note.Id,
            Name: note.Name,
            tags: note.Tags ? note.Tags.split(',') : [],
            title: note.title,
            content: note.content,
            createdAt: note.created_at,
            updatedAt: note.updated_at
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, noteData) {
    await delay(300);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: noteData.Name || noteData.title || 'Note',
          Tags: Array.isArray(noteData.tags) ? noteData.tags.join(',') : '',
          title: noteData.title,
          content: noteData.content,
          created_at: noteData.createdAt,
          updated_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const note = successfulUpdates[0].data;
          return {
            Id: note.Id,
            Name: note.Name,
            tags: note.Tags ? note.Tags.split(',') : [],
            title: note.title,
            content: note.content,
            createdAt: note.created_at,
            updatedAt: note.updated_at
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    await delay(200);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const noteService = new NoteService();