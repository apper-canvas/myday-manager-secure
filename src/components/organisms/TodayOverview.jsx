import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, isToday, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { timeBlockService } from "@/services/api/timeBlockService";
import { noteService } from "@/services/api/noteService";

const TodayOverview = ({ onAddItem }) => {
  const [tasks, setTasks] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, timeBlocksData, notesData] = await Promise.all([
        taskService.getAll(),
        timeBlockService.getAll(),
        noteService.getAll()
      ]);

      const todayTasks = tasksData.filter(task => 
        task.dueDate && isToday(parseISO(task.dueDate))
      );
      
      const todayTimeBlocks = timeBlocksData.filter(block => 
        isToday(parseISO(block.startTime))
      );
      
      const sortedNotes = notesData.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );

setTasks(todayTasks);
      setTimeBlocks(todayTimeBlocks);
      setRecentNotes(sortedNotes.slice(0, 3));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimeBlock = () => {
    const now = new Date();
    return timeBlocks.find(block => {
      const start = parseISO(block.startTime);
      const end = parseISO(block.endTime);
      return now >= start && now <= end;
    });
  };

  const getNextTimeBlock = () => {
    const now = new Date();
    const upcoming = timeBlocks
      .filter(block => parseISO(block.startTime) > now)
      .sort((a, b) => parseISO(a.startTime) - parseISO(b.startTime));
    return upcoming[0];
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "Done").length;
    const inProgress = tasks.filter(task => task.status === "In Progress").length;
    const todo = tasks.filter(task => task.status === "To Do").length;
    
    return { total, completed, inProgress, todo };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTodayData} />;

  const currentBlock = getCurrentTimeBlock();
  const nextBlock = getNextTimeBlock();
  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            Today's Overview
          </h2>
          <p className="text-gray-600">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => onAddItem("task")}
            variant="ghost"
            size="small"
            icon="Plus"
          >
            Task
          </Button>
          <Button
            onClick={() => onAddItem("timeblock")}
            variant="ghost"
            size="small"
            icon="Plus"
          >
            Time Block
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-success mb-1">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-info mb-1">
            {stats.inProgress}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-warning mb-1">
            {stats.todo}
          </div>
          <div className="text-sm text-gray-600">To Do</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 font-display">
              Current Activity
            </h3>
            <ApperIcon name="Clock" className="w-5 h-5 text-primary" />
          </div>
          
          {currentBlock ? (
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {currentBlock.title}
                  </h4>
                  <CategoryBadge category={currentBlock.category} />
                </div>
                <p className="text-sm text-gray-600">
                  {format(parseISO(currentBlock.startTime), "h:mm a")} - 
                  {format(parseISO(currentBlock.endTime), "h:mm a")}
                </p>
              </div>
              
              {nextBlock && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Next: {nextBlock.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(parseISO(nextBlock.startTime), "h:mm a")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <ApperIcon name="Calendar" className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No current time block</p>
            </div>
          )}
        </Card>

        {/* Today's Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 font-display">
              Today's Tasks
            </h3>
            <ApperIcon name="CheckSquare" className="w-5 h-5 text-primary" />
          </div>
          
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <PriorityBadge priority={task.priority} />
                      <span className="text-xs text-gray-500">
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-primary transition-colors">
                    <ApperIcon name="ExternalLink" className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {tasks.length > 4 && (
                <p className="text-sm text-gray-500 text-center">
                  +{tasks.length - 4} more tasks
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <ApperIcon name="CheckSquare" className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks for today</p>
            </div>
          )}
        </Card>

        {/* Recent Notes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 font-display">
              Recent Notes
            </h3>
            <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
          </div>
          
          {recentNotes.length > 0 ? (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div key={note.Id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {note.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {note.content.replace(/<[^>]*>/g, "").substring(0, 80)}...
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(note.updatedAt), "MMM d")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <ApperIcon name="FileText" className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent notes</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TodayOverview;