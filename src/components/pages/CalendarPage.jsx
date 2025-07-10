import React, { useState } from "react";
import TimeBlockCalendar from "@/components/organisms/TimeBlockCalendar";
import QuickAddModal from "@/components/organisms/QuickAddModal";

const CalendarPage = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const handleAddBlock = () => {
    setShowQuickAdd(true);
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setShowQuickAdd(true);
  };

  const handleQuickAddSuccess = () => {
    // Refresh the calendar data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <TimeBlockCalendar
        onAddBlock={handleAddBlock}
        onEditBlock={handleEditBlock}
      />
      
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => {
          setShowQuickAdd(false);
          setEditingBlock(null);
        }}
        type="timeblock"
        onSuccess={handleQuickAddSuccess}
      />
    </div>
  );
};

export default CalendarPage;