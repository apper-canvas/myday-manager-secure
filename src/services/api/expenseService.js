import { toast } from "react-toastify";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseService = {
  async getAll() {
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
          { field: { Name: "amount" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } }
        ]
      };

      const response = await apperClient.fetchRecords('expense', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(expense => ({
        Id: expense.Id,
        Name: expense.Name,
        Tags: expense.Tags,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching expenses:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

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
          { field: { Name: "amount" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } }
        ]
      };

      const response = await apperClient.getRecordById('expense', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const expense = response.data;
      return {
        Id: expense.Id,
        Name: expense.Name,
        Tags: expense.Tags,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching expense with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(expenseData) {
    await delay(300);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: expenseData.Name || expenseData.description || 'Expense',
          Tags: expenseData.Tags || '',
          amount: expenseData.amount,
          category: expenseData.category,
          description: expenseData.description,
          date: expenseData.date || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('expense', params);
      
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
          const expense = successfulRecords[0].data;
          return {
            Id: expense.Id,
            Name: expense.Name,
            Tags: expense.Tags,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: expense.date
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating expense:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, expenseData) {
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
          Name: expenseData.Name || expenseData.description || 'Expense',
          Tags: expenseData.Tags || '',
          amount: expenseData.amount,
          category: expenseData.category,
          description: expenseData.description,
          date: expenseData.date
        }]
      };

      const response = await apperClient.updateRecord('expense', params);
      
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
          const expense = successfulUpdates[0].data;
          return {
            Id: expense.Id,
            Name: expense.Name,
            Tags: expense.Tags,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: expense.date
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating expense:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

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

      const response = await apperClient.deleteRecord('expense', params);
      
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
        console.error("Error deleting expense:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};