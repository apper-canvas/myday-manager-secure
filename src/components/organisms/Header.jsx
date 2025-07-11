import React, { useContext } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Header = ({ onMenuClick, currentView = "Today" }) => {
  const today = new Date();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {currentView}
            </h1>
            <p className="text-sm text-gray-600">
              {format(today, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="hidden sm:flex items-center space-x-6 text-sm text-gray-600"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>3 completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>2 pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>1 in progress</span>
            </div>
          </motion.div>

          <Button
            variant="ghost"
            size="small"
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="Bell" className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user?.firstName || user?.name || 'User'}
            </span>
            <Button
              variant="ghost"
              size="small"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
              title="Logout"
            >
              <ApperIcon name="LogOut" className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;