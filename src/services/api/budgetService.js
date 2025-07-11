import { toast } from "react-toastify";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const budgetService = {
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
          { field: { Name: "category" } },
          { field: { Name: "daily_limit" } },
          { field: { Name: "monthly_limit" } }
        ]
      };

      const response = await apperClient.fetchRecords('budget', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(budget => ({
        Id: budget.Id,
        Name: budget.Name,
        Tags: budget.Tags,
        category: budget.category,
        dailyLimit: budget.daily_limit,
        monthlyLimit: budget.monthly_limit
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching budgets:", error?.response?.data?.message);
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
          { field: { Name: "category" } },
          { field: { Name: "daily_limit" } },
          { field: { Name: "monthly_limit" } }
        ]
      };

      const response = await apperClient.getRecordById('budget', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const budget = response.data;
      return {
        Id: budget.Id,
        Name: budget.Name,
        Tags: budget.Tags,
        category: budget.category,
        dailyLimit: budget.daily_limit,
        monthlyLimit: budget.monthly_limit
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching budget with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(budgetData) {
    await delay(300);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: budgetData.Name || `${budgetData.category} Budget`,
          Tags: budgetData.Tags || '',
          category: budgetData.category,
          daily_limit: budgetData.dailyLimit,
          monthly_limit: budgetData.monthlyLimit
        }]
      };

      const response = await apperClient.createRecord('budget', params);
      
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
          const budget = successfulRecords[0].data;
          return {
            Id: budget.Id,
            Name: budget.Name,
            Tags: budget.Tags,
            category: budget.category,
            dailyLimit: budget.daily_limit,
            monthlyLimit: budget.monthly_limit
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating budget:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, budgetData) {
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
          Name: budgetData.Name || `${budgetData.category} Budget`,
          Tags: budgetData.Tags || '',
          category: budgetData.category,
          daily_limit: budgetData.dailyLimit,
          monthly_limit: budgetData.monthlyLimit
        }]
      };

      const response = await apperClient.updateRecord('budget', params);
      
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
          const budget = successfulUpdates[0].data;
          return {
            Id: budget.Id,
            Name: budget.Name,
            Tags: budget.Tags,
            category: budget.category,
            dailyLimit: budget.daily_limit,
            monthlyLimit: budget.monthly_limit
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating budget:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('budget', params);
      
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
        console.error("Error deleting budget:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};