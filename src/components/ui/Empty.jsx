import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Inbox", 
  title = "Nothing here yet", 
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "CheckSquare",
          title: "No tasks yet",
          description: "Create your first task to get started with your productivity journey",
          actionLabel: "Add Task"
        };
      case "notes":
        return {
          icon: "FileText",
          title: "No notes yet",
          description: "Start capturing your thoughts and ideas with your first note",
          actionLabel: "Create Note"
        };
      case "timeblocks":
        return {
          icon: "Calendar",
          title: "No time blocks scheduled",
          description: "Plan your day by creating time blocks for your activities",
          actionLabel: "Add Time Block"
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          description: "Try adjusting your search terms or filters",
          actionLabel: "Clear Search"
        };
      default:
        return { icon, title, description, actionLabel };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={content.icon} className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {content.description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          icon="Plus"
          className="shadow-floating hover:shadow-floating"
        >
          {content.actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;