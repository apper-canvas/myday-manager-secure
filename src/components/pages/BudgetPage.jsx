import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { expenseService } from "@/services/api/expenseService";
import { budgetService } from "@/services/api/budgetService";

const BudgetPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "Personal",
    description: "",
    date: format(new Date(), "yyyy-MM-dd")
  });

  const [budgetForm, setBudgetForm] = useState({
    category: "Personal",
    dailyLimit: "",
    monthlyLimit: ""
  });

  const categories = ["Work", "Personal", "Health", "Learning", "Leisure", "Finance"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, budgetsData] = await Promise.all([
        expenseService.getAll(),
        budgetService.getAll()
      ]);
      setExpenses(expensesData);
      setBudgets(budgetsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        date: new Date(expenseForm.date).toISOString()
      };

      if (editingExpense) {
        await expenseService.update(editingExpense.Id, expenseData);
        toast.success("Expense updated successfully");
      } else {
        await expenseService.create(expenseData);
        toast.success("Expense added successfully");
      }

      setExpenseForm({
        amount: "",
        category: "Personal",
        description: "",
        date: format(new Date(), "yyyy-MM-dd")
      });
      setShowExpenseForm(false);
      setEditingExpense(null);
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      const budgetData = {
        ...budgetForm,
        dailyLimit: parseFloat(budgetForm.dailyLimit),
        monthlyLimit: parseFloat(budgetForm.monthlyLimit)
      };

      if (editingBudget) {
        await budgetService.update(editingBudget.Id, budgetData);
        toast.success("Budget updated successfully");
      } else {
        await budgetService.create(budgetData);
        toast.success("Budget created successfully");
      }

      setBudgetForm({
        category: "Personal",
        dailyLimit: "",
        monthlyLimit: ""
      });
      setShowBudgetForm(false);
      setEditingBudget(null);
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expenseService.delete(id);
        toast.success("Expense deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await budgetService.delete(id);
        toast.success("Budget deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const startEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      date: format(new Date(expense.date), "yyyy-MM-dd")
    });
    setShowExpenseForm(true);
  };

  const startEditBudget = (budget) => {
    setEditingBudget(budget);
    setBudgetForm({
      category: budget.category,
      dailyLimit: budget.dailyLimit.toString(),
      monthlyLimit: budget.monthlyLimit.toString()
    });
    setShowBudgetForm(true);
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

  const getCategorySpending = (category) => {
    const today = format(new Date(), "yyyy-MM-dd");
    return expenses
      .filter(expense => 
        expense.category === category && 
        format(new Date(expense.date), "yyyy-MM-dd") === today
      )
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryBudget = (category) => {
    const budget = budgets.find(b => b.category === category);
    return budget ? budget.dailyLimit : 0;
  };

  if (loading) return <Loading type="budget" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const todaySpending = getTodaySpending();
  const totalDailyLimit = getTotalDailyLimit();
  const progressPercentage = totalDailyLimit > 0 ? (todaySpending / totalDailyLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Budget Tracker
          </h1>
          <p className="text-gray-600 mt-1">
            Track your daily spending and manage budgets by category
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            onClick={() => setShowExpenseForm(true)}
            icon="Plus"
            variant="primary"
          >
            Add Expense
          </Button>
          <Button
            onClick={() => setShowBudgetForm(true)}
            icon="Settings"
            variant="secondary"
          >
            Set Budget
          </Button>
        </div>
      </div>

      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Spending</h3>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="text-3xl font-bold text-gray-900">
              ${todaySpending.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              of ${totalDailyLimit.toFixed(2)} daily limit
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
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
            <ApperIcon name="PieChart" className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {categories.map(category => {
              const spending = getCategorySpending(category);
              const budget = getCategoryBudget(category);
              return (
                <div key={category} className={`category-spending ${category.toLowerCase()}`}>
                  <div className="flex items-center space-x-2">
                    <CategoryBadge category={category} />
                    <span className="text-sm text-gray-600">
                      ${spending.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    / ${budget.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
          <Button
            variant="ghost"
            size="small"
            onClick={loadData}
            icon="RefreshCw"
          >
            Refresh
          </Button>
        </div>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Receipt" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No expenses recorded yet</p>
            </div>
          ) : (
            expenses.slice(0, 10).map(expense => (
              <motion.div
                key={expense.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="expense-item"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CategoryBadge category={expense.category} />
                    <div>
                      <div className="font-medium text-gray-900">
                        {expense.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => startEditExpense(expense)}
                        icon="Edit"
                      />
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleDeleteExpense(expense.Id)}
                        icon="Trash2"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </h3>
              <Button
                variant="ghost"
                size="small"
                onClick={() => {
                  setShowExpenseForm(false);
                  setEditingExpense(null);
                  setExpenseForm({
                    amount: "",
                    category: "Personal",
                    description: "",
                    date: format(new Date(), "yyyy-MM-dd")
                  });
                }}
                icon="X"
              />
            </div>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <FormField
                label="Amount"
                type="number"
                step="0.01"
                min="0"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
              <FormField
                label="Category"
                type="select"
                value={expenseForm.category}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </FormField>
              <FormField
                label="Description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
              <FormField
                label="Date"
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                required
              />
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingExpense ? "Update" : "Add"} Expense
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowExpenseForm(false);
                    setEditingExpense(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingBudget ? "Edit Budget" : "Set Budget"}
              </h3>
              <Button
                variant="ghost"
                size="small"
                onClick={() => {
                  setShowBudgetForm(false);
                  setEditingBudget(null);
                  setBudgetForm({
                    category: "Personal",
                    dailyLimit: "",
                    monthlyLimit: ""
                  });
                }}
                icon="X"
              />
            </div>
            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <FormField
                label="Category"
                type="select"
                value={budgetForm.category}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </FormField>
              <FormField
                label="Daily Limit"
                type="number"
                step="0.01"
                min="0"
                value={budgetForm.dailyLimit}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, dailyLimit: e.target.value }))}
                required
              />
              <FormField
                label="Monthly Limit"
                type="number"
                step="0.01"
                min="0"
                value={budgetForm.monthlyLimit}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                required
              />
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingBudget ? "Update" : "Set"} Budget
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowBudgetForm(false);
                    setEditingBudget(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;