import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import TagInput from "@/components/molecules/TagInput";
import { taskService } from "@/services/api/taskService";
import { timeBlockService } from "@/services/api/timeBlockService";
import { noteService } from "@/services/api/noteService";

const QuickAddModal = ({ isOpen, onClose, type, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    category: "Work",
    startTime: "",
    endTime: "",
    content: "",
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      category: "Work",
      startTime: "",
      endTime: "",
      content: "",
      tags: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let newItem;
      
      if (type === "task") {
        newItem = await taskService.create({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate || null,
          status: "To Do",
          kanbanColumn: "To Do"
        });
        toast.success("Task created successfully!");
      } else if (type === "timeblock") {
        newItem = await timeBlockService.create({
          title: formData.title,
          startTime: formData.startTime,
          endTime: formData.endTime,
          category: formData.category,
          color: getCategoryColor(formData.category),
          reminder: false
        });
        toast.success("Time block created successfully!");
      } else if (type === "note") {
        newItem = await noteService.create({
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast.success("Note created successfully!");
      }

      onSuccess?.(newItem);
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to create item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: "#5B4CDB",
      Personal: "#4ECDC4",
      Health: "#FF6B6B",
      Learning: "#FFD93D",
      Leisure: "#4DA6FF"
    };
    return colors[category] || colors.Work;
  };

  const getModalTitle = () => {
    switch (type) {
      case "task":
        return "Create New Task";
      case "timeblock":
        return "Create Time Block";
      case "note":
        return "Create New Note";
      default:
        return "Create New Item";
    }
  };

  const renderTaskForm = () => (
    <>
      <FormField
        label="Task Title"
        value={formData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Enter task title"
        required
      />
      <FormField
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        placeholder="Enter task description"
      />
      <FormField
        label="Priority"
        type="select"
        value={formData.priority}
        onChange={(e) => handleInputChange("priority", e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </FormField>
      <FormField
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleInputChange("dueDate", e.target.value)}
      />
    </>
  );

  const renderTimeBlockForm = () => (
    <>
      <FormField
        label="Title"
        value={formData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Enter time block title"
        required
      />
      <FormField
        label="Category"
        type="select"
        value={formData.category}
        onChange={(e) => handleInputChange("category", e.target.value)}
      >
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Health">Health</option>
        <option value="Learning">Learning</option>
        <option value="Leisure">Leisure</option>
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Time"
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) => handleInputChange("startTime", e.target.value)}
          required
        />
        <FormField
          label="End Time"
          type="datetime-local"
          value={formData.endTime}
          onChange={(e) => handleInputChange("endTime", e.target.value)}
          required
        />
      </div>
    </>
  );

  const renderNoteForm = () => (
    <>
      <FormField
        label="Note Title"
        value={formData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Enter note title"
        required
      />
      <FormField
        label="Content"
        type="textarea"
        value={formData.content}
        onChange={(e) => handleInputChange("content", e.target.value)}
        placeholder="Write your note content here..."
        className="min-h-[120px]"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <TagInput
          tags={formData.tags}
          onTagsChange={(tags) => handleInputChange("tags", tags)}
          placeholder="Add tags (press Enter to add)"
        />
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-floating max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 font-display">
                {getModalTitle()}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {type === "task" && renderTaskForm()}
              {type === "timeblock" && renderTimeBlockForm()}
              {type === "note" && renderNoteForm()}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !formData.title}
                  icon={isSubmitting ? "Loader2" : "Plus"}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;