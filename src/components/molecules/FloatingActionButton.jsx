import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FloatingActionButton = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: "Calendar", label: "Time Block", action: "timeblock" },
    { icon: "CheckSquare", label: "Task", action: "task" },
    { icon: "FileText", label: "Note", action: "note" }
  ];

  const handleAction = (action) => {
    onAction(action);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.action}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  x: 20,
                  transition: { delay: (actions.length - index - 1) * 0.1 }
                }}
                onClick={() => handleAction(action.action)}
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <ApperIcon name={action.icon} className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-floating hover:shadow-floating text-white transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="Plus" className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;