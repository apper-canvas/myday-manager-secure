import React, { useState } from "react";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import QuickAddModal from "@/components/organisms/QuickAddModal";

const TasksPage = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    setShowQuickAdd(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowQuickAdd(true);
  };

  const handleQuickAddSuccess = () => {
    // Refresh the tasks data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <KanbanBoard
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
      />
      
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => {
          setShowQuickAdd(false);
          setEditingTask(null);
        }}
        type="task"
        onSuccess={handleQuickAddSuccess}
      />
    </div>
  );
};

export default TasksPage;