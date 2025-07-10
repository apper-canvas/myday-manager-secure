import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const navigation = [
    { name: "Today", href: "/", icon: "Home" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Notes", href: "/notes", icon: "FileText" },
    { name: "Budget", href: "/budget", icon: "DollarSign" }
  ];
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 font-display">
            MyDay Manager
          </h1>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
              isActive
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-r-2 border-primary"
                : "text-gray-700 hover:bg-gray-50 hover:text-primary"
            )}
          >
            <ApperIcon 
              name={item.icon} 
              className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" 
            />
            {item.name}
          </NavLink>
        ))}
      </nav>

<div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            Quick Stats
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Today's Tasks</span>
              <span className="font-medium text-primary">5</span>
            </div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span className="font-medium text-success">3</span>
            </div>
            <div className="flex justify-between">
              <span>Today's Budget</span>
              <span className="font-medium text-accent">$50</span>
            </div>
            <div className="flex justify-between">
              <span>Spent</span>
              <span className="font-medium text-error">$35</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 shadow-xl"
          >
            <SidebarContent />
          </motion.div>
        </>
      )}
    </>
  );
};

export default Sidebar;