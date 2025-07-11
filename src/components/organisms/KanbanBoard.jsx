import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";

const KanbanBoard = ({ onEditTask, onAddTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: "To Do", title: "To Do", color: "bg-gray-100" },
    { id: "In Progress", title: "In Progress", color: "bg-blue-100" },
    { id: "Done", title: "Done", color: "bg-green-100" }
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTasksForColumn = (columnId) => {
    return tasks.filter(task => task.status === columnId);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== columnId) {
      const updatedTask = { ...draggedTask, status: columnId };
await taskService.update(draggedTask.Id, updatedTask);
      setTasks(prev => 
        prev.map(task => 
          task.Id === draggedTask.Id ? updatedTask : task
        )
      );
      setDraggedTask(null);
    }
  };

  const TaskCard = ({ task }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onClick={() => onEditTask(task)}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-card-hover transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
          {task.title}
        </h3>
        <PriorityBadge priority={task.priority} />
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        {task.dueDate && (
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>{format(new Date(task.dueDate), "MMM d")}</span>
          </div>
        )}
        <ApperIcon name="GripVertical" className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );

  if (loading) return <Loading type="kanban" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            Task Board
          </h2>
          <p className="text-gray-600">
            Manage your tasks with drag and drop
          </p>
        </div>
        <Button
          onClick={onAddTask}
          variant="primary"
          icon="Plus"
        >
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksForColumn(column.id);
          
          return (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-gray-900">
                    {column.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    ({columnTasks.length})
                  </span>
                </div>
              </div>
              
              <div
                className="kanban-column space-y-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.map((task) => (
                  <TaskCard key={task.Id} task={task} />
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <Empty
          type="tasks"
          onAction={onAddTask}
        />
      )}
    </div>
  );
};

export default KanbanBoard;