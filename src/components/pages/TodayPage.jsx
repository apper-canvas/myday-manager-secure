import React, { useState } from "react";
import TodayOverview from "@/components/organisms/TodayOverview";
import QuickAddModal from "@/components/organisms/QuickAddModal";

const TodayPage = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState("task");

  const handleAddItem = (type) => {
    setQuickAddType(type);
    setShowQuickAdd(true);
  };

  const handleQuickAddSuccess = () => {
    // Refresh the today overview data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <TodayOverview onAddItem={handleAddItem} />
      
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        type={quickAddType}
        onSuccess={handleQuickAddSuccess}
      />
    </div>
  );
};

export default TodayPage;