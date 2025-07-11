import { toast } from "react-toastify";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TimeBlockService {
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
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "category" } },
          { field: { Name: "color" } },
          { field: { Name: "reminder" } }
        ]
      };

      const response = await apperClient.fetchRecords('time_block', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(timeBlock => ({
        Id: timeBlock.Id,
        Name: timeBlock.Name,
        Tags: timeBlock.Tags,
        title: timeBlock.title,
        startTime: timeBlock.start_time,
        endTime: timeBlock.end_time,
        category: timeBlock.category,
        color: timeBlock.color,
        reminder: timeBlock.reminder === 'true' || timeBlock.reminder === true
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching time blocks:", error?.response?.data?.message);
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
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "category" } },
          { field: { Name: "color" } },
          { field: { Name: "reminder" } }
        ]
      };

      const response = await apperClient.getRecordById('time_block', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const timeBlock = response.data;
      return {
        Id: timeBlock.Id,
        Name: timeBlock.Name,
        Tags: timeBlock.Tags,
        title: timeBlock.title,
        startTime: timeBlock.start_time,
        endTime: timeBlock.end_time,
        category: timeBlock.category,
        color: timeBlock.color,
        reminder: timeBlock.reminder === 'true' || timeBlock.reminder === true
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching time block with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(timeBlockData) {
    await delay(400);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: timeBlockData.Name || timeBlockData.title || 'Time Block',
          Tags: timeBlockData.Tags || '',
          title: timeBlockData.title,
          start_time: timeBlockData.startTime,
          end_time: timeBlockData.endTime,
          category: timeBlockData.category,
          color: timeBlockData.color,
          reminder: timeBlockData.reminder ? 'true' : 'false'
        }]
      };

      const response = await apperClient.createRecord('time_block', params);
      
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
          const timeBlock = successfulRecords[0].data;
          return {
            Id: timeBlock.Id,
            Name: timeBlock.Name,
            Tags: timeBlock.Tags,
            title: timeBlock.title,
            startTime: timeBlock.start_time,
            endTime: timeBlock.end_time,
            category: timeBlock.category,
            color: timeBlock.color,
            reminder: timeBlock.reminder === 'true' || timeBlock.reminder === true
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating time block:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, timeBlockData) {
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
          Name: timeBlockData.Name || timeBlockData.title || 'Time Block',
          Tags: timeBlockData.Tags || '',
          title: timeBlockData.title,
          start_time: timeBlockData.startTime,
          end_time: timeBlockData.endTime,
          category: timeBlockData.category,
          color: timeBlockData.color,
          reminder: timeBlockData.reminder ? 'true' : 'false'
        }]
      };

      const response = await apperClient.updateRecord('time_block', params);
      
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
          const timeBlock = successfulUpdates[0].data;
          return {
            Id: timeBlock.Id,
            Name: timeBlock.Name,
            Tags: timeBlock.Tags,
            title: timeBlock.title,
            startTime: timeBlock.start_time,
            endTime: timeBlock.end_time,
            category: timeBlock.category,
            color: timeBlock.color,
            reminder: timeBlock.reminder === 'true' || timeBlock.reminder === true
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating time block:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('time_block', params);
      
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
        console.error("Error deleting time block:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const timeBlockService = new TimeBlockService();