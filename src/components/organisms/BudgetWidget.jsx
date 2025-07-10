import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import ApperIcon from "@/components/ApperIcon";
import { expenseService } from "@/services/api/expenseService";
import { budgetService } from "@/services/api/budgetService";

const BudgetWidget = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, budgetsData] = await Promise.all([
        expenseService.getAll(),
        budgetService.getAll()
      ]);
      setExpenses(expensesData);
      setBudgets(budgetsData);
    } catch (err) {
      console.error("Error loading budget data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTodayExpenses = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    return expenses.filter(expense => 
      format(new Date(expense.date), "yyyy-MM-dd") === today
    );
  };

  const getTodaySpending = () => {
    return getTodayExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalDailyLimit = () => {
    return budgets.reduce((total, budget) => total + (budget.dailyLimit || 0), 0);
  };

  const getTopCategories = () => {
    const categorySpending = {};
    const today = format(new Date(), "yyyy-MM-dd");
    
    expenses
      .filter(expense => format(new Date(expense.date), "yyyy-MM-dd") === today)
      .forEach(expense => {
        categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
      });

    return Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));
  };

  if (loading) {
    return (
      <Card className="budget-widget">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </Card>
    );
  }

  const todaySpending = getTodaySpending();
  const totalDailyLimit = getTotalDailyLimit();
  const progressPercentage = totalDailyLimit > 0 ? (todaySpending / totalDailyLimit) * 100 : 0;
  const topCategories = getTopCategories();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="budget-widget">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="DollarSign" className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Today's Budget</h3>
          </div>
          <Link to="/budget">
            <Button variant="ghost" size="small" icon="ExternalLink">
              View All
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-gray-900">
              ${todaySpending.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              of ${totalDailyLimit.toFixed(2)}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`budget-progress h-2 rounded-full transition-all duration-300 ${
                progressPercentage > 100 ? 'over-budget' : 
                progressPercentage > 80 ? 'warning' : ''
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>

          <div className="text-sm">
            {progressPercentage > 100 ? (
              <span className="text-error font-medium">
                Over budget by ${(todaySpending - totalDailyLimit).toFixed(2)}
              </span>
            ) : (
              <span className="text-success font-medium">
                ${(totalDailyLimit - todaySpending).toFixed(2)} remaining
              </span>
            )}
          </div>

          {topCategories.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Top Categories</div>
              <div className="space-y-1">
                {topCategories.map(({ category, amount }) => (
                  <div key={category} className="flex items-center justify-between">
                    <CategoryBadge category={category} />
                    <span className="text-sm font-medium text-gray-900">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default BudgetWidget;