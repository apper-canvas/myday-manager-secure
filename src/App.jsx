import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import FloatingActionButton from "@/components/molecules/FloatingActionButton";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import TodayPage from "@/components/pages/TodayPage";
import CalendarPage from "@/components/pages/CalendarPage";
import TasksPage from "@/components/pages/TasksPage";
import NotesPage from "@/components/pages/NotesPage";
import BudgetPage from "@/components/pages/BudgetPage";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState("task");

  const handleFloatingAction = (type) => {
    setQuickAddType(type);
    setShowQuickAdd(true);
  };

  const handleQuickAddSuccess = () => {
    // Refresh the current page data
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          currentView="MyDay Manager"
        />
        
        <main className="p-4 lg:p-6">
<Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Routes>
        </main>
      </div>

      <FloatingActionButton onAction={handleFloatingAction} />
      
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        type={quickAddType}
        onSuccess={handleQuickAddSuccess}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;