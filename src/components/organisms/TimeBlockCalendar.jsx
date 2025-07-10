import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { timeBlockService } from "@/services/api/timeBlockService";

const TimeBlockCalendar = ({ onEditBlock, onAddBlock }) => {
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [draggedBlock, setDraggedBlock] = useState(null);

  useEffect(() => {
    loadTimeBlocks();
  }, []);

  const loadTimeBlocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeBlockService.getAll();
      setTimeBlocks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const startDate = startOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  };

  const getBlocksForDay = (day) => {
    return timeBlocks.filter(block => 
      isSameDay(new Date(block.startTime), day)
    );
  };

  const getTimeSlots = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      return {
        time: `${hour.toString().padStart(2, "0")}:00`,
        hour
      };
    });
  };

  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    if (draggedBlock) {
      const newStartTime = new Date(day);
      newStartTime.setHours(hour, 0, 0, 0);
      
      const duration = new Date(draggedBlock.endTime) - new Date(draggedBlock.startTime);
      const newEndTime = new Date(newStartTime.getTime() + duration);
      
      const updatedBlock = {
        ...draggedBlock,
        startTime: newStartTime.toISOString(),
        endTime: newEndTime.toISOString()
      };
      
      timeBlockService.update(draggedBlock.Id, updatedBlock);
      setTimeBlocks(prev => 
        prev.map(block => 
          block.Id === draggedBlock.Id ? updatedBlock : block
        )
      );
      setDraggedBlock(null);
    }
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  if (loading) return <Loading type="calendar" />;
  if (error) return <Error message={error} onRetry={loadTimeBlocks} />;

  const weekDays = getWeekDays();
  const timeSlots = getTimeSlots();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            Time Blocks
          </h2>
          <p className="text-gray-600">
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigateWeek(-1)}
            icon="ChevronLeft"
          />
          <Button
            variant="ghost"
            size="small"
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigateWeek(1)}
            icon="ChevronRight"
            iconPosition="right"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-8 gap-0">
          {/* Time column */}
          <div className="border-r border-gray-200">
            <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">Time</span>
            </div>
            {timeSlots.map((slot) => (
              <div
                key={slot.time}
                className="h-16 border-b border-gray-200 bg-gray-50 flex items-center justify-center"
              >
                <span className="text-xs text-gray-500">{slot.time}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="border-r border-gray-200 last:border-r-0">
              <div className="h-12 border-b border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 uppercase">
                  {format(day, "EEE")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {format(day, "d")}
                </span>
              </div>
              
              {timeSlots.map((slot) => (
                <div
                  key={`${day.toISOString()}-${slot.hour}`}
                  className="h-16 border-b border-gray-200 p-1 hover:bg-gray-50 transition-colors relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day, slot.hour)}
                >
                  {getBlocksForDay(day)
                    .filter(block => {
                      const blockStart = new Date(block.startTime);
                      return blockStart.getHours() === slot.hour;
                    })
                    .map((block) => (
                      <motion.div
                        key={block.Id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block)}
                        onClick={() => onEditBlock(block)}
                        className="absolute inset-1 time-block cursor-move group"
                      >
                        <div className="p-2 h-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium truncate">
                              {block.title}
                            </span>
                            <ApperIcon name="GripVertical" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[10px] opacity-90">
                            {format(new Date(block.startTime), "HH:mm")} - {format(new Date(block.endTime), "HH:mm")}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {timeBlocks.length === 0 && (
        <Empty
          type="timeblocks"
          onAction={onAddBlock}
        />
      )}
    </div>
  );
};

export default TimeBlockCalendar;